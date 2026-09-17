<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    try {
        $dbStatus = 'Connected';
        $dbName = DB::connection()->getDatabaseName();
        $counts = [
            'campaigns' => DB::table('campaigns')->count(),
            'donations' => DB::table('donations')->count(),
            'donors' => DB::table('donors')->count(),
            'volunteers' => DB::table('volunteers')->count(),
            'csr_inquiries' => DB::table('csr_inquiries')->count(),
            'reports' => DB::table('reports')->count(),
            'blogs' => DB::table('blog_posts')->count(),
            'feedbacks' => DB::table('feedbacks')->count(),
            'users' => DB::table('users')->count(),
        ];
        $recentCampaigns = DB::table('campaigns')->orderByDesc('id')->limit(5)->get();
        $recentDonations = DB::table('donations')->orderByDesc('created_date')->limit(5)->get();
        $org = DB::table('organization_info')->first();
        $totalDonationAmount = DB::table('donations')->where('status', 'success')->sum('amount');
    } catch (\Throwable $e) {
        $dbStatus = 'Error: ' . $e->getMessage();
        $dbName = 'Gagal Terhubung: ' . $e->getMessage();
        $counts = [
            'campaigns' => 0,
            'donations' => 0,
            'donors' => 0,
            'volunteers' => 0,
            'csr_inquiries' => 0,
            'reports' => 0,
            'blogs' => 0,
            'feedbacks' => 0,
            'users' => 0,
        ];
        $recentCampaigns = collect();
        $recentDonations = collect();
        $org = null;
        $totalDonationAmount = 0;
    }

    return view('backend_portal', compact(
        'dbStatus', 'dbName', 'counts', 'recentCampaigns', 'recentDonations', 'org', 'totalDonationAmount'
    ));
});
