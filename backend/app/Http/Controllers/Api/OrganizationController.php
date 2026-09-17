<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrganizationInfo;

class OrganizationController extends Controller
{
    public function show()
    {
        $org = OrganizationInfo::first();
        if (!$org) {
            return response()->json([
                'name' => 'Amanah Impact Foundation',
                'slug' => 'amanah-impact-foundation',
                'phone' => '(021) 8888-1234',
                'email' => 'info@amanahimpact.org',
                'address' => 'Gedung Menara Amanah Lantai 4, Jl. Kemakmuran No. 12 Jakarta Pusat, Indonesia',
                'skKemenkumham' => 'AHU-00123.AH.01.04 TAHUN 2024',
                'npwp' => '45.123.456.7-012.000',
                'dinsosReg' => '312/DINSOS-PP/2025',
                'description' => 'Lembaga amil zakat, wakaf, dan kemanusiaan modern bersertifikasi resmi.',
            ]);
        }

        return response()->json([
            'id' => $org->id,
            'name' => $org->name,
            'slug' => $org->slug,
            'phone' => $org->phone,
            'email' => $org->email,
            'address' => $org->address,
            'skKemenkumham' => $org->sk_kemenkumham,
            'npwp' => $org->npwp,
            'dinsosReg' => $org->dinsos_reg,
            'description' => $org->description,
        ]);
    }

    public function update(Request $request)
    {
        $org = OrganizationInfo::first();
        if (!$org) {
            $org = new OrganizationInfo();
        }

        $data = $request->all();
        if (isset($data['name'])) $org->name = $data['name'];
        if (isset($data['phone'])) $org->phone = $data['phone'];
        if (isset($data['email'])) $org->email = $data['email'];
        if (isset($data['address'])) $org->address = $data['address'];
        if (isset($data['skKemenkumham'])) $org->sk_kemenkumham = $data['skKemenkumham'];
        if (isset($data['npwp'])) $org->npwp = $data['npwp'];
        if (isset($data['dinsosReg'])) $org->dinsos_reg = $data['dinsosReg'];
        if (isset($data['description'])) $org->description = $data['description'];

        $org->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil yayasan berhasil diperbarui.',
            'data' => $org,
        ]);
    }
}
