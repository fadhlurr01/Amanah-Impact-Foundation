<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Organization Info
        Schema::create('organization_info', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->default('amanah-impact-foundation');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('sk_kemenkumham')->nullable();
            $table->string('npwp')->nullable();
            $table->string('dinsos_reg')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Campaigns
        Schema::create('campaigns', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category');
            $table->string('status')->default('active');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_urgent')->default(false);
            $table->decimal('target_amount', 15, 2)->default(0);
            $table->decimal('collected_amount', 15, 2)->default(0);
            $table->decimal('disbursed_amount', 15, 2)->default(0);
            $table->integer('beneficiary_target')->default(0);
            $table->integer('beneficiary_reached')->default(0);
            $table->string('location')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('story')->nullable();
            $table->json('fund_usage')->nullable();
            $table->text('image_url')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->text('video_url')->nullable();
            $table->string('user_email')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });

        // 3. Campaign Updates / Milestone
        Schema::create('campaign_updates', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('campaign_slug');
            $table->string('title');
            $table->date('date');
            $table->text('description');
            $table->text('image_url')->nullable();
            $table->decimal('amount_spent', 15, 2)->default(0);
            $table->timestamps();
        });

        // 4. Donations
        Schema::create('donations', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('donor_name');
            $table->string('donor_email');
            $table->string('donor_phone')->nullable();
            $table->string('campaign_title');
            $table->string('campaign_slug');
            $table->decimal('amount', 15, 2);
            $table->string('category')->nullable();
            $table->string('payment_method')->default('QRIS');
            $table->string('status')->default('success');
            $table->boolean('is_anonymous')->default(false);
            $table->text('message')->nullable();
            $table->string('receipt_number');
            $table->dateTime('created_date');
            $table->dateTime('paid_date')->nullable();
            $table->string('certificate_number')->nullable();
            $table->string('user_email')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });

        // 5. Donors CRM
        Schema::create('donors', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('category')->default('Regular');
            $table->decimal('total_donated', 15, 2)->default(0);
            $table->integer('donation_count')->default(0);
            $table->date('last_donation_date')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });

        // 6. Volunteers
        Schema::create('volunteers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->json('skills')->nullable();
            $table->text('experience')->nullable();
            $table->string('status')->default('Pending');
            $table->date('joined_date');
            $table->timestamps();
        });

        // 7. CSR Inquiries
        Schema::create('csr_inquiries', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('company_name');
            $table->string('pic_name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('interested_program')->default('Pendidikan');
            $table->string('budget_range')->nullable();
            $table->string('status')->default('In Discussion');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 8. Transparency Reports
        Schema::create('reports', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('period');
            $table->integer('year');
            $table->decimal('total_income', 15, 2)->default(0);
            $table->decimal('total_disbursed', 15, 2)->default(0);
            $table->decimal('operational_cost', 15, 2)->default(0);
            $table->string('audit_opinion')->default('Wajar Tanpa Pengecualian (WTP)');
            $table->text('pdf_url')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // 9. Blog Posts
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Edukasi');
            $table->string('author')->default('Tim Media Amanah');
            $table->string('status')->default('published');
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('language')->default('id');
            $table->date('published_date');
            $table->text('image_url')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->string('user_email')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });

        // 10. Testimonials
        Schema::create('testimonials', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('role');
            $table->text('content');
            $table->text('message')->nullable();
            $table->text('avatar_url')->nullable();
            $table->string('location')->nullable();
            $table->integer('rating')->default(5);
            $table->string('type')->default('beneficiary');
            $table->timestamps();
        });

        // 11. FAQs
        Schema::create('faqs', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('category')->default('Donasi');
            $table->text('question');
            $table->text('answer');
            $table->timestamps();
        });

        // 12. Feedbacks
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->integer('rating')->default(5);
            $table->string('category')->default('Fitur Baru');
            $table->text('message');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('csr_inquiries');
        Schema::dropIfExists('volunteers');
        Schema::dropIfExists('donors');
        Schema::dropIfExists('donations');
        Schema::dropIfExists('campaign_updates');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('organization_info');
    }
};
