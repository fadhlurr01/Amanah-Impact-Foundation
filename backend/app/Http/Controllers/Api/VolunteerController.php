<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\Volunteer;

class VolunteerController extends Controller
{
    private function mapVolunteer($v)
    {
        $skills = $v->skills;
        if (is_string($skills)) {
            $decoded = json_decode($skills, true);
            $skills = is_array($decoded) ? $decoded : [$skills];
        } elseif (!is_array($skills)) {
            $skills = [];
        }

        $regDate = $v->registered_date ? (is_string($v->registered_date) ? substr($v->registered_date, 0, 10) : $v->registered_date->format('Y-m-d')) : null;

        return [
            'id' => (string)$v->id,
            'name' => $v->name,
            'email' => $v->email,
            'phone' => $v->whatsapp ?? $v->phone ?? '',
            'whatsapp' => $v->whatsapp ?? '',
            'city' => $v->city ?? '',
            'skills' => $skills,
            'interestArea' => $v->interest_area ?? '',
            'availability' => $v->availability ?? '',
            'experience' => $v->experience ?? '',
            'status' => $v->status ?? 'pending',
            'registeredDate' => $regDate,
            'joinedDate' => $regDate,
            'isDemo' => (bool)$v->is_demo,
        ];
    }

    public function index()
    {
        $orderCol = Schema::hasColumn('volunteers', 'registered_date') ? 'registered_date' : 'id';
        $volunteers = Volunteer::orderBy($orderCol, 'desc')->get()->map(function($v) {
            return $this->mapVolunteer($v);
        });
        return response()->json($volunteers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'whatsapp' => 'nullable|string',
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'skills' => 'nullable',
            'interestArea' => 'nullable|string',
            'availability' => 'nullable|string',
            'experience' => 'nullable|string',
        ]);

        $num = Volunteer::count() + 1;
        $id = 'VOL-' . str_pad((string)$num, 2, '0', STR_PAD_LEFT);

        $skills = $validated['skills'] ?? ['Logistik & Medis'];
        if (is_string($skills)) {
            $skills = array_map('trim', explode(',', $skills));
        }

        $volunteer = Volunteer::create([
            'id' => $id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'whatsapp' => $validated['whatsapp'] ?? $validated['phone'] ?? '',
            'city' => $validated['city'] ?? 'Jakarta',
            'skills' => $skills,
            'interest_area' => $validated['interestArea'] ?? 'Sosial & Bencana',
            'availability' => $validated['availability'] ?? 'Akhir Pekan',
            'experience' => $validated['experience'] ?? '',
            'status' => 'pending',
            'registered_date' => now()->format('Y-m-d'),
            'is_demo' => false,
        ]);

        return response()->json($this->mapVolunteer($volunteer), 201);
    }

    public function update(Request $request, string $id)
    {
        $volunteer = Volunteer::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        $volunteer->status = $validated['status'];
        $volunteer->save();

        return response()->json($this->mapVolunteer($volunteer));
    }

    public function destroy(string $id)
    {
        $volunteer = Volunteer::findOrFail($id);
        $volunteer->delete();
        return response()->json(['success' => true, 'message' => 'Relawan berhasil dihapus dari database.']);
    }
}
