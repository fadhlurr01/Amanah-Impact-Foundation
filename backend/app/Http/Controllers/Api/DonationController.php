<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\Donation;
use App\Models\Campaign;
use App\Models\Donor;
use App\Models\User;

class DonationController extends Controller
{
    private function mapDonation($d)
    {
        return [
            'id' => (string)$d->id,
            'donorName' => $d->donor_name,
            'donorEmail' => $d->donor_email,
            'donorPhone' => $d->donor_phone ?? '',
            'campaignTitle' => $d->campaign_title,
            'campaignSlug' => $d->campaign_slug,
            'amount' => (float)$d->amount,
            'category' => $d->category ?? 'Umum',
            'paymentMethod' => $d->payment_method ?? 'QRIS',
            'status' => $d->status ?? 'success',
            'isAnonymous' => (bool)$d->is_anonymous,
            'message' => $d->message ?? '',
            'receiptNumber' => $d->receipt_number,
            'createdDate' => $d->created_date ? (is_string($d->created_date) ? $d->created_date : $d->created_date->toIso8601String()) : null,
            'paidDate' => $d->paid_date ? (is_string($d->paid_date) ? $d->paid_date : $d->paid_date->toIso8601String()) : null,
            'certificateNumber' => $d->certificate_number,
            'userEmail' => $d->user_email ?? null,
            'userId' => $d->user_id ?? null,
            'isDemo' => (bool)$d->is_demo,
        ];
    }

    public function index(Request $request)
    {
        $userEmail = $request->query('user_email');
        $isAdmin = filter_var($request->query('is_admin'), FILTER_VALIDATE_BOOLEAN);

        $query = Donation::query();

        if ($userEmail && $isAdmin) {
            $user = User::where('email', strtolower(trim($userEmail)))->first();
            if ($user && !$user->is_demo) {
                if (Schema::hasColumn('donations', 'user_email')) {
                    $query->where('user_email', $userEmail)->where('is_demo', false);
                } elseif (Schema::hasColumn('donations', 'user_id')) {
                    $query->where('user_id', $user->id)->where('is_demo', false);
                }
            }
        }

        $orderCol = Schema::hasColumn('donations', 'created_date') ? 'created_date' : 'id';
        $donations = $query->orderBy($orderCol, 'desc')->get()->map(function($d) {
            return $this->mapDonation($d);
        });

        return response()->json($donations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'donorName' => 'required|string|max:255',
            'donorEmail' => 'required|email|max:255',
            'amount' => 'required|numeric|min:1000',
            'campaignSlug' => 'required|string',
            'campaignTitle' => 'nullable|string',
            'paymentMethod' => 'nullable|string',
            'isAnonymous' => 'nullable|boolean',
            'message' => 'nullable|string',
            'donorPhone' => 'nullable|string',
            'category' => 'nullable|string',
            'userEmail' => 'nullable|string',
        ]);

        $campaign = Campaign::where('slug', $validated['campaignSlug'])->orWhere('id', $validated['campaignSlug'])->first();
        $campaignTitle = $campaign ? $campaign->title : ($validated['campaignTitle'] ?? 'Donasi Kemanusiaan Umum');
        $category = $campaign ? $campaign->category : ($validated['category'] ?? 'Umum');

        $num = Donation::count() + 1;
        $id = 'D-' . str_pad((string)$num, 4, '0', STR_PAD_LEFT);
        $receiptNumber = 'AIF-RCPT-2026-' . str_pad((string)$num, 6, '0', STR_PAD_LEFT);
        $certificateNumber = 'AIF-CERT-GEN-' . str_pad((string)$num, 4, '0', STR_PAD_LEFT);

        $userEmail = $validated['userEmail'] ?? ($campaign ? ($campaign->user_email ?? null) : 'admin@amanah.org');
        $user = $userEmail ? User::where('email', $userEmail)->first() : null;
        $isDemo = $user ? (bool)$user->is_demo : false;

        $donationData = [
            'id' => $id,
            'donor_name' => $validated['donorName'],
            'donor_email' => $validated['donorEmail'],
            'donor_phone' => $validated['donorPhone'] ?? '',
            'campaign_title' => $campaignTitle,
            'campaign_slug' => $validated['campaignSlug'],
            'amount' => $validated['amount'],
            'category' => $category,
            'payment_method' => $validated['paymentMethod'] ?? 'QRIS Instant Syariah',
            'status' => 'success',
            'is_anonymous' => $validated['isAnonymous'] ?? false,
            'message' => $validated['message'] ?? '',
            'receipt_number' => $receiptNumber,
            'created_date' => now(),
            'paid_date' => now(),
            'certificate_number' => $certificateNumber,
            'is_demo' => $isDemo,
        ];

        if (Schema::hasColumn('donations', 'user_email')) {
            $donationData['user_email'] = $userEmail;
        }
        if (Schema::hasColumn('donations', 'user_id')) {
            $donationData['user_id'] = $user ? $user->id : 'usr-admin-demo';
        }

        $donation = Donation::create($donationData);

        // Update campaign collected amount & beneficiaries
        if ($campaign) {
            $campaign->increment('collected_amount', $validated['amount']);
            if (Schema::hasColumn('campaigns', 'beneficiary_reached')) {
                $campaign->increment('beneficiary_reached', 1);
            }
        }

        // Update or create donor in CRM
        if (!($validated['isAnonymous'] ?? false)) {
            $donor = Donor::where('email', $validated['donorEmail'])->first();
            if ($donor) {
                if (Schema::hasColumn('donors', 'total_donation')) {
                    $donor->increment('total_donation', $validated['amount']);
                } elseif (Schema::hasColumn('donors', 'total_donated')) {
                    $donor->increment('total_donated', $validated['amount']);
                }
                if (Schema::hasColumn('donors', 'donation_count')) {
                    $donor->increment('donation_count', 1);
                }
                if (Schema::hasColumn('donors', 'last_donation_date')) {
                    $donor->last_donation_date = now()->format('Y-m-d');
                }
                $donor->save();
            } else {
                $dnrCount = Donor::count() + 1;
                $donorData = [
                    'id' => 'DNR-' . str_pad((string)$dnrCount, 2, '0', STR_PAD_LEFT),
                    'name' => $validated['donorName'],
                    'email' => $validated['donorEmail'],
                    'notes' => 'Donatur via web online',
                    'is_demo' => $isDemo,
                ];

                if (Schema::hasColumn('donors', 'user_id')) {
                    $donorData['user_id'] = $user ? $user->id : 'usr-admin-demo';
                }
                if (Schema::hasColumn('donors', 'whatsapp')) {
                    $donorData['whatsapp'] = $validated['donorPhone'] ?? '';
                }
                if (Schema::hasColumn('donors', 'phone')) {
                    $donorData['phone'] = $validated['donorPhone'] ?? '';
                }
                if (Schema::hasColumn('donors', 'type')) {
                    $donorData['type'] = $validated['amount'] >= 50000000 ? 'VIP' : 'Individual';
                }
                if (Schema::hasColumn('donors', 'category')) {
                    $donorData['category'] = $validated['amount'] >= 50000000 ? 'VIP' : 'Regular';
                }
                if (Schema::hasColumn('donors', 'total_donation')) {
                    $donorData['total_donation'] = $validated['amount'];
                }
                if (Schema::hasColumn('donors', 'total_donated')) {
                    $donorData['total_donated'] = $validated['amount'];
                }
                if (Schema::hasColumn('donors', 'donation_count')) {
                    $donorData['donation_count'] = 1;
                }
                if (Schema::hasColumn('donors', 'created_at')) {
                    $donorData['created_at'] = now();
                }
                if (Schema::hasColumn('donors', 'last_donation_date')) {
                    $donorData['last_donation_date'] = now()->format('Y-m-d');
                }

                Donor::create($donorData);
            }
        }

        return response()->json($this->mapDonation($donation), 201);
    }

    public function verify(Request $request, string $id)
    {
        $donation = Donation::findOrFail($id);
        $newStatus = $request->input('status', 'success');
        $donation->status = $newStatus;
        if ($newStatus === 'success' && empty($donation->paid_date)) {
            $donation->paid_date = now();
        }
        $donation->save();

        return response()->json($this->mapDonation($donation));
    }

    public function destroy(string $id)
    {
        $donation = Donation::findOrFail($id);
        $donation->delete();

        return response()->json(['success' => true, 'message' => 'Data donasi berhasil dihapus dari database.']);
    }
}
