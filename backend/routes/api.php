<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\DonorController;
use App\Http\Controllers\Api\VolunteerController;
use App\Http\Controllers\Api\CsrController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\AdminMaintenanceController;

// 1. Authentication
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
Route::put('/auth/change-password', [AuthController::class, 'changePassword']);

// 2. Organization Info
Route::get('/organization', [OrganizationController::class, 'show']);
Route::put('/organization', [OrganizationController::class, 'update']);

// 3. Campaigns
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{slug}', [CampaignController::class, 'show']);
Route::post('/campaigns', [CampaignController::class, 'store']);
Route::put('/campaigns/{id}', [CampaignController::class, 'update']);
Route::delete('/campaigns/{id}', [CampaignController::class, 'destroy']);

// 4. Donations
Route::get('/donations', [DonationController::class, 'index']);
Route::post('/donations', [DonationController::class, 'store']);
Route::post('/donations/{id}/verify', [DonationController::class, 'verify']);
Route::delete('/donations/{id}', [DonationController::class, 'destroy']);

// 5. Donors CRM
Route::get('/donors', [DonorController::class, 'index']);
Route::post('/donors', [DonorController::class, 'store']);
Route::put('/donors/{id}', [DonorController::class, 'update']);
Route::put('/donors/{id}/note', [DonorController::class, 'updateNote']);
Route::delete('/donors/{id}', [DonorController::class, 'destroy']);

// 6. Volunteers
Route::get('/volunteers', [VolunteerController::class, 'index']);
Route::post('/volunteers', [VolunteerController::class, 'store']);
Route::put('/volunteers/{id}', [VolunteerController::class, 'update']);
Route::put('/volunteers/{id}/status', [VolunteerController::class, 'update']);
Route::delete('/volunteers/{id}', [VolunteerController::class, 'destroy']);

// 7. CSR Inquiries
Route::get('/csr-inquiries', [CsrController::class, 'index']);
Route::post('/csr-inquiries', [CsrController::class, 'store']);
Route::put('/csr-inquiries/{id}', [CsrController::class, 'update']);
Route::put('/csr-inquiries/{id}/pipeline', [CsrController::class, 'update']);
Route::delete('/csr-inquiries/{id}', [CsrController::class, 'destroy']);

// 8. Transparency Reports
Route::get('/reports', [ReportController::class, 'index']);
Route::post('/reports', [ReportController::class, 'store']);
Route::put('/reports/{id}', [ReportController::class, 'update']);
Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

// 9. Educational Blogs
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
Route::post('/blogs', [BlogController::class, 'store']);
Route::put('/blogs/{id}', [BlogController::class, 'update']);
Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);

// 10. Testimonials
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);

// 11. FAQs
Route::get('/faqs', [FaqController::class, 'index']);
Route::post('/faqs', [FaqController::class, 'store']);
Route::put('/faqs/{id}', [FaqController::class, 'update']);
Route::delete('/faqs/{id}', [FaqController::class, 'destroy']);

// 12. Feedbacks
Route::get('/feedbacks', [FeedbackController::class, 'index']);
Route::post('/feedbacks', [FeedbackController::class, 'store']);
Route::delete('/feedbacks/{id}', [FeedbackController::class, 'destroy']);

// 13. Admin Maintenance (Backup / Restore / Reset)
Route::get('/admin/backup', [AdminMaintenanceController::class, 'backup']);
Route::post('/admin/restore', [AdminMaintenanceController::class, 'restore']);
Route::post('/admin/reset', [AdminMaintenanceController::class, 'reset']);
