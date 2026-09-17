<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use App\Models\OrganizationInfo;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Donor;
use App\Models\Volunteer;
use App\Models\CsrInquiry;
use App\Models\Report;
use App\Models\BlogPost;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\Feedback;

class AdminMaintenanceController extends Controller
{
    public function backup()
    {
        $data = [
            'version' => '1.0.0',
            'exportedAt' => now()->toIso8601String(),
            'platform' => 'Amanah Impact Foundation Laravel Platform',
            'tables' => [
                'users' => User::all(),
                'organizationInfo' => OrganizationInfo::all(),
                'campaigns' => Campaign::all(),
                'donations' => Donation::all(),
                'donors' => Donor::all(),
                'volunteers' => Volunteer::all(),
                'csrInquiries' => CsrInquiry::all(),
                'reports' => Report::all(),
                'blogs' => BlogPost::all(),
                'testimonials' => Testimonial::all(),
                'faqs' => Faq::all(),
                'feedbacks' => Feedback::all(),
            ]
        ];

        return response()->json($data);
    }

    public function restore(Request $request)
    {
        $payload = $request->input('tables') ?: $request->all();

        if (empty($payload)) {
            return response()->json(['success' => false, 'message' => 'Format file cadangan tidak valid.'], 400);
        }

        if (!empty($payload['campaigns'])) {
            foreach ($payload['campaigns'] as $c) {
                Campaign::updateOrCreate(['id' => $c['id']], $c);
            }
        }

        if (!empty($payload['donations'])) {
            foreach ($payload['donations'] as $d) {
                Donation::updateOrCreate(['id' => $d['id']], $d);
            }
        }

        if (!empty($payload['donors'])) {
            foreach ($payload['donors'] as $dnr) {
                Donor::updateOrCreate(['id' => $dnr['id']], $dnr);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Data cadangan berhasil dipulihkan ke basis data.',
        ]);
    }

    public function reset()
    {
        Artisan::call('migrate:fresh', ['--seed' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Basis data berhasil direset ke seed data demo awal yang bersih.',
        ]);
    }
}
