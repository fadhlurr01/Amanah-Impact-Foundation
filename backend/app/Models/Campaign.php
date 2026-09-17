<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'slug',
        'title',
        'category',
        'status',
        'is_featured',
        'is_urgent',
        'target_amount',
        'collected_amount',
        'disbursed_amount',
        'beneficiary_target',
        'beneficiary_reached',
        'location',
        'start_date',
        'end_date',
        'short_description',
        'story',
        'fund_usage',
        'image_url',
        'thumbnail_url',
        'video_url',
        'user_email',
        'is_demo',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_urgent' => 'boolean',
        'is_demo' => 'boolean',
        'target_amount' => 'float',
        'collected_amount' => 'float',
        'disbursed_amount' => 'float',
        'beneficiary_target' => 'integer',
        'beneficiary_reached' => 'integer',
        'fund_usage' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function updates()
    {
        return $this->hasMany(CampaignUpdate::class, 'campaign_slug', 'slug');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'campaign_slug', 'slug');
    }
}
