<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'donor_name',
        'donor_email',
        'donor_phone',
        'campaign_title',
        'campaign_slug',
        'amount',
        'category',
        'payment_method',
        'status',
        'is_anonymous',
        'message',
        'receipt_number',
        'created_date',
        'paid_date',
        'certificate_number',
        'user_email',
        'is_demo',
    ];

    protected $casts = [
        'amount' => 'float',
        'is_anonymous' => 'boolean',
        'is_demo' => 'boolean',
        'created_date' => 'datetime',
        'paid_date' => 'datetime',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_slug', 'slug');
    }
}
