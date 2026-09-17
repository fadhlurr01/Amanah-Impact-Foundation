<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\Report;

class ReportController extends Controller
{
    private function mapReport($r)
    {
        $received = (float)($r->total_received ?? $r->total_income ?? 0);
        $disbursed = (float)$r->total_disbursed;
        $remaining = (float)($r->remaining_balance ?? ($received - $disbursed));
        $date = $r->published_date ? (is_string($r->published_date) ? substr($r->published_date, 0, 10) : $r->published_date->format('Y-m-d')) : null;
        $year = $date ? (int)substr($date, 0, 4) : 2026;

        return [
            'id' => (string)$r->id,
            'title' => $r->title,
            'campaignSlug' => $r->campaign_slug ?? '',
            'type' => $r->type ?? 'Financial Audit',
            'period' => $r->period ?? 'Tahunan',
            'year' => $year,
            'totalIncome' => $received,
            'totalReceived' => $received,
            'totalDisbursed' => $disbursed,
            'remainingBalance' => $remaining,
            'operationalCost' => max(0, $received * 0.08),
            'auditOpinion' => $r->audit_status ?? 'Wajar Tanpa Pengecualian (WTP)',
            'auditStatus' => $r->audit_status ?? 'Wajar Tanpa Pengecualian (WTP)',
            'description' => $r->description ?? '',
            'pdfUrl' => '/reports/laporan_keuangan_wtp_2026.pdf',
            'isPublished' => (bool)($r->public_visibility ?? true),
            'publishedDate' => $date,
            'isDemo' => (bool)$r->is_demo,
        ];
    }

    public function index()
    {
        $orderCol = Schema::hasColumn('reports', 'published_date') ? 'published_date' : 'id';
        $reports = Report::orderBy($orderCol, 'desc')->get()->map(function($r) {
            return $this->mapReport($r);
        });
        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'period' => 'required|string',
            'totalIncome' => 'nullable|numeric',
            'totalReceived' => 'nullable|numeric',
            'totalDisbursed' => 'required|numeric',
            'auditOpinion' => 'nullable|string',
            'auditStatus' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $received = $validated['totalReceived'] ?? $validated['totalIncome'] ?? 0;
        $disbursed = $validated['totalDisbursed'];

        $id = 'REP-' . date('Y') . '-' . str_pad((string)(Report::count() + 1), 2, '0', STR_PAD_LEFT);

        $report = Report::create([
            'id' => $id,
            'title' => $validated['title'],
            'campaign_slug' => '',
            'type' => 'Financial Audit',
            'period' => $validated['period'],
            'total_received' => $received,
            'total_disbursed' => $disbursed,
            'remaining_balance' => max(0, $received - $disbursed),
            'public_visibility' => true,
            'audit_status' => $validated['auditStatus'] ?? $validated['auditOpinion'] ?? 'Wajar Tanpa Pengecualian (WTP)',
            'description' => $validated['description'] ?? 'Laporan audit transparansi keuangan terintegrasi.',
            'published_date' => now()->format('Y-m-d'),
            'is_demo' => false,
        ]);

        return response()->json($this->mapReport($report), 201);
    }

    public function destroy(string $id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['success' => true, 'message' => 'Laporan audit berhasil dihapus.']);
    }
}
