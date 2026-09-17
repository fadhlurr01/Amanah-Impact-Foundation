<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Campaign;
use App\Models\User;

class CampaignController extends Controller
{
    private function mapCampaign($c)
    {
        return [
            'id' => $c->id,
            'title' => $c->title,
            'slug' => $c->slug,
            'category' => $c->category,
            'status' => $c->status,
            'isFeatured' => (bool)$c->is_featured,
            'isUrgent' => (bool)$c->is_urgent,
            'targetAmount' => (float)$c->target_amount,
            'collectedAmount' => (float)$c->collected_amount,
            'disbursedAmount' => (float)$c->disbursed_amount,
            'beneficiaryTarget' => (int)$c->beneficiary_target,
            'beneficiaryReached' => (int)$c->beneficiary_reached,
            'location' => $c->location,
            'startDate' => $c->start_date ? (is_string($c->start_date) ? substr($c->start_date, 0, 10) : $c->start_date->format('Y-m-d')) : null,
            'endDate' => $c->end_date ? (is_string($c->end_date) ? substr($c->end_date, 0, 10) : $c->end_date->format('Y-m-d')) : null,
            'shortDescription' => $c->short_description,
            'story' => $c->story,
            'fundUsage' => is_string($c->fund_usage) ? json_decode($c->fund_usage, true) : ($c->fund_usage ?? []),
            'imageUrl' => (str_contains((string)$c->image_url, '1541829011853') || empty($c->image_url))
                ? (str_contains((string)$c->slug, 'pesantren') || str_contains((string)$c->slug, 'wakaf') 
                    ? 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200' 
                    : 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1200')
                : $c->image_url,
            'thumbnailUrl' => (str_contains((string)$c->thumbnail_url, '1541829011853') || empty($c->thumbnail_url))
                ? (str_contains((string)$c->slug, 'pesantren') || str_contains((string)$c->slug, 'wakaf') 
                    ? 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200' 
                    : 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1200')
                : ($c->thumbnail_url ?: $c->image_url),
            'videoUrl' => $c->video_url,
            'userEmail' => $c->user_email ?? null,
            'userId' => $c->user_id ?? null,
            'isDemo' => (bool)$c->is_demo,
        ];
    }

    public function index(Request $request)
    {
        $userEmail = $request->query('user_email');
        $isAdmin = filter_var($request->query('is_admin'), FILTER_VALIDATE_BOOLEAN);

        $query = Campaign::query();

        if ($userEmail && $isAdmin) {
            $user = User::where('email', strtolower(trim($userEmail)))->first();
            if ($user && !$user->is_demo) {
                // Newly registered user: isolated workspace
                if (Schema::hasColumn('campaigns', 'user_email')) {
                    $query->where('user_email', $userEmail)->where('is_demo', false);
                } elseif (Schema::hasColumn('campaigns', 'user_id')) {
                    $query->where('user_id', $user->id)->where('is_demo', false);
                }
            }
        }

        $campaigns = $query->orderBy('created_at', 'desc')->get()->map(function($c) {
            return $this->mapCampaign($c);
        });

        return response()->json($campaigns);
    }

    public function show($slug)
    {
        $campaign = Campaign::where('slug', $slug)->orWhere('id', $slug)->first();
        if (!$campaign) {
            return response()->json(['message' => 'Kampanye tidak ditemukan.'], 404);
        }

        return response()->json($this->mapCampaign($campaign));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'targetAmount' => 'required|numeric|min:1000',
            'shortDescription' => 'required|string',
            'location' => 'nullable|string',
            'story' => 'nullable|string',
            'fundUsage' => 'nullable|array',
            'imageUrl' => 'nullable|string',
            'thumbnailUrl' => 'nullable|string',
            'beneficiaryTarget' => 'nullable|integer',
            'userEmail' => 'nullable|string',
            'isUrgent' => 'nullable|boolean',
            'isFeatured' => 'nullable|boolean',
        ]);

        $id = 'C-' . str_pad((string)(Campaign::count() + 1), 2, '0', STR_PAD_LEFT);
        $slug = Str::slug($validated['title']) . '-' . strtolower(Str::random(4));

        $userEmail = $validated['userEmail'] ?? 'admin@amanah.org';
        $user = User::where('email', $userEmail)->first();
        $isDemo = $user ? (bool)$user->is_demo : true;

        $campaignData = [
            'id' => $id,
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'status' => 'active',
            'is_featured' => $validated['isFeatured'] ?? false,
            'is_urgent' => $validated['isUrgent'] ?? false,
            'target_amount' => $validated['targetAmount'],
            'collected_amount' => 0,
            'disbursed_amount' => 0,
            'beneficiary_target' => $validated['beneficiaryTarget'] ?? 100,
            'beneficiary_reached' => 0,
            'location' => $validated['location'] ?? 'Indonesia',
            'start_date' => now(),
            'end_date' => now()->addMonths(6),
            'short_description' => $validated['shortDescription'],
            'story' => $validated['story'] ?? $validated['shortDescription'],
            'fund_usage' => $validated['fundUsage'] ?? [],
            'image_url' => $validated['imageUrl'] ?? 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200',
            'thumbnail_url' => $validated['thumbnailUrl'] ?? $validated['imageUrl'] ?? 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600',
            'is_demo' => $isDemo,
        ];

        if (Schema::hasColumn('campaigns', 'user_email')) {
            $campaignData['user_email'] = $userEmail;
        }
        if (Schema::hasColumn('campaigns', 'user_id')) {
            $campaignData['user_id'] = $user ? $user->id : 'usr-admin-demo';
        }

        $campaign = Campaign::create($campaignData);

        return response()->json($this->mapCampaign($campaign), 201);
    }

    public function update(Request $request, $id)
    {
        $campaign = Campaign::where('id', $id)->orWhere('slug', $id)->first();
        if (!$campaign) {
            return response()->json(['message' => 'Kampanye tidak ditemukan.'], 404);
        }

        $data = $request->all();
        if (isset($data['title'])) $campaign->title = $data['title'];
        if (isset($data['category'])) $campaign->category = $data['category'];
        if (isset($data['targetAmount'])) $campaign->target_amount = $data['targetAmount'];
        if (isset($data['collectedAmount'])) $campaign->collected_amount = $data['collectedAmount'];
        if (isset($data['disbursedAmount'])) $campaign->disbursed_amount = $data['disbursedAmount'];
        if (isset($data['shortDescription'])) $campaign->short_description = $data['shortDescription'];
        if (isset($data['story'])) $campaign->story = $data['story'];
        if (isset($data['location'])) $campaign->location = $data['location'];
        if (isset($data['imageUrl'])) $campaign->image_url = $data['imageUrl'];
        if (isset($data['status'])) $campaign->status = $data['status'];
        if (isset($data['isUrgent'])) $campaign->is_urgent = $data['isUrgent'];
        if (isset($data['isFeatured'])) $campaign->is_featured = $data['isFeatured'];
        if (isset($data['fundUsage'])) $campaign->fund_usage = $data['fundUsage'];

        $campaign->save();

        return response()->json($this->mapCampaign($campaign));
    }

    public function destroy($id)
    {
        $campaign = Campaign::where('id', $id)->orWhere('slug', $id)->first();
        if ($campaign) {
            $campaign->delete();
        }
        return response()->json(['success' => true, 'message' => 'Kampanye berhasil dihapus.']);
    }
}
