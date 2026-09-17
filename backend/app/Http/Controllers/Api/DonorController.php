<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\Donor;
use App\Models\User;

class DonorController extends Controller
{
    private function mapDonor($d)
    {
        $phone = $d->whatsapp ?? $d->phone ?? '';
        $total = (float)($d->total_donation ?? $d->total_donated ?? 0);
        $count = (int)($d->donation_count ?? 0);
        $lastDate = $d->created_at ? (is_string($d->created_at) ? substr($d->created_at, 0, 10) : $d->created_at->format('Y-m-d')) : null;

        return [
            'id' => (string)$d->id,
            'name' => $d->name,
            'email' => $d->email,
            'phone' => $phone,
            'whatsapp' => $phone,
            'city' => $d->city ?? '',
            'province' => $d->province ?? '',
            'type' => $d->type ?? 'Individual',
            'segment' => $d->segment ?? 'Retail',
            'category' => $d->type ?? 'Regular',
            'totalDonation' => $total,
            'totalDonated' => $total,
            'donationCount' => $count,
            'lastDonationDate' => $lastDate,
            'notes' => $d->notes ?? '',
            'isDemo' => (bool)$d->is_demo,
        ];
    }

    public function index(Request $request)
    {
        $userEmail = $request->query('user_email');
        $isAdmin = filter_var($request->query('is_admin'), FILTER_VALIDATE_BOOLEAN);

        $query = Donor::query();
        if ($userEmail && $isAdmin) {
            $user = User::where('email', strtolower(trim($userEmail)))->first();
            if ($user && !$user->is_demo && Schema::hasColumn('donors', 'is_demo')) {
                $query->where('is_demo', false);
            }
        }

        $orderCol = Schema::hasColumn('donors', 'total_donation') ? 'total_donation' : (Schema::hasColumn('donors', 'total_donated') ? 'total_donated' : 'id');
        $donors = $query->orderBy($orderCol, 'desc')->get()->map(function($d) {
            return $this->mapDonor($d);
        });

        return response()->json($donors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'category' => 'nullable|string',
            'type' => 'nullable|string',
            'totalDonation' => 'nullable|numeric',
            'totalDonated' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        $num = Donor::count() + 1;
        $id = 'DNR-' . str_pad((string)$num, 2, '0', STR_PAD_LEFT);
        $total = $validated['totalDonation'] ?? $validated['totalDonated'] ?? 0;
        $phone = $validated['whatsapp'] ?? $validated['phone'] ?? '';

        $data = [
            'id' => $id,
            'name' => $validated['name'],
            'email' => $validated['email'] ?? '',
            'whatsapp' => $phone,
            'type' => $validated['type'] ?? $validated['category'] ?? 'Individual',
            'segment' => 'Retail',
            'total_donation' => $total,
            'donation_count' => 1,
            'notes' => $validated['notes'] ?? '',
            'is_demo' => false,
            'created_at' => now(),
        ];

        $donor = Donor::create($data);

        return response()->json($this->mapDonor($donor), 201);
    }

    public function update(Request $request, string $id)
    {
        $donor = Donor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'category' => 'nullable|string',
            'type' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['email'])) $updateData['email'] = $validated['email'];
        if (isset($validated['phone']) || isset($validated['whatsapp'])) {
            $updateData['whatsapp'] = $validated['whatsapp'] ?? $validated['phone'];
        }
        if (isset($validated['type']) || isset($validated['category'])) {
            $updateData['type'] = $validated['type'] ?? $validated['category'];
        }
        if (isset($validated['notes'])) $updateData['notes'] = $validated['notes'];

        $donor->update($updateData);

        return response()->json($this->mapDonor($donor));
    }

    public function updateNote(Request $request, string $id)
    {
        $donor = Donor::findOrFail($id);
        $donor->notes = $request->input('notes', '');
        $donor->save();

        return response()->json($this->mapDonor($donor));
    }

    public function destroy(string $id)
    {
        $donor = Donor::findOrFail($id);
        $donor->delete();
        return response()->json(['success' => true, 'message' => 'Donatur berhasil dihapus dari sistem.']);
    }
}
