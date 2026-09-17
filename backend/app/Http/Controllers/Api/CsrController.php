<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\CsrInquiry;

class CsrController extends Controller
{
    private function mapCsr($c)
    {
        $status = $c->pipeline_status ?? $c->status ?? 'new';

        return [
            'id' => (string)$c->id,
            'companyName' => $c->company_name,
            'picName' => $c->pic_name,
            'position' => $c->position ?? 'CSR Lead',
            'email' => $c->email ?? '',
            'phone' => $c->whatsapp ?? $c->phone ?? '',
            'whatsapp' => $c->whatsapp ?? '',
            'website' => $c->website ?? '',
            'interestedProgram' => $c->interested_program ?? 'Pendidikan',
            'budgetRange' => $c->budget_range ?? 'Rp50.000.000 - Rp100.000.000',
            'status' => $status,
            'pipelineStatus' => $status,
            'message' => $c->message ?? '',
            'notes' => $c->message ?? '',
            'isDemo' => (bool)$c->is_demo,
            'createdAt' => $c->created_date ? (is_string($c->created_date) ? substr($c->created_date, 0, 10) : $c->created_date->format('Y-m-d')) : null,
        ];
    }

    public function index()
    {
        $orderCol = Schema::hasColumn('csr_inquiries', 'created_date') ? 'created_date' : 'id';
        $csrs = CsrInquiry::orderBy($orderCol, 'desc')->get()->map(function($c) {
            return $this->mapCsr($c);
        });
        return response()->json($csrs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'companyName' => 'required|string|max:255',
            'picName' => 'required|string|max:255',
            'position' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|string',
            'interestedProgram' => 'nullable|string',
            'budgetRange' => 'nullable|string',
            'message' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $num = CsrInquiry::count() + 1;
        $id = 'CSR-' . str_pad((string)$num, 2, '0', STR_PAD_LEFT);

        $csr = CsrInquiry::create([
            'id' => $id,
            'company_name' => $validated['companyName'],
            'pic_name' => $validated['picName'],
            'position' => $validated['position'] ?? 'Perwakilan Manajemen',
            'email' => $validated['email'] ?? '',
            'whatsapp' => $validated['whatsapp'] ?? $validated['phone'] ?? '',
            'website' => $validated['website'] ?? '',
            'interested_program' => $validated['interestedProgram'] ?? 'Pendidikan Santri & Dhuafa',
            'budget_range' => $validated['budgetRange'] ?? 'Rp50juta - Rp100juta',
            'message' => $validated['message'] ?? $validated['notes'] ?? '',
            'pipeline_status' => 'new',
            'created_date' => now(),
            'is_demo' => false,
        ]);

        return response()->json($this->mapCsr($csr), 201);
    }

    public function update(Request $request, string $id)
    {
        $csr = CsrInquiry::findOrFail($id);

        $newStatus = $request->input('pipelineStage') ?? $request->input('pipeline_status') ?? $request->input('status');
        if ($newStatus) {
            $csr->pipeline_status = $newStatus;
            $csr->save();
        }

        return response()->json($this->mapCsr($csr));
    }

    public function destroy(string $id)
    {
        $csr = CsrInquiry::findOrFail($id);
        $csr->delete();
        return response()->json(['success' => true, 'message' => 'Inkuiri CSR berhasil dihapus.']);
    }
}
