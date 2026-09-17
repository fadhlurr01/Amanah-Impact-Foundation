<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'campaign_slug',
        'type',
        'period',
        'total_received',
        'total_disbursed',
        'remaining_balance',
        'public_visibility',
        'audit_status',
        'description',
        'published_date',
        'is_demo',
    ];

    protected $casts = [
        'total_received' => 'float',
        'total_disbursed' => 'float',
        'remaining_balance' => 'float',
        'public_visibility' => 'boolean',
        'is_demo' => 'boolean',
        'published_date' => 'date',
    ];
}
