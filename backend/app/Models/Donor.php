<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'email',
        'whatsapp',
        'city',
        'province',
        'type',
        'segment',
        'total_donation',
        'donation_count',
        'is_recurring',
        'is_vip',
        'tags',
        'follow_up_status',
        'notes',
        'is_demo',
        'created_at',
    ];

    protected $casts = [
        'total_donation' => 'float',
        'donation_count' => 'integer',
        'is_recurring' => 'boolean',
        'is_vip' => 'boolean',
        'is_demo' => 'boolean',
        'created_at' => 'datetime',
    ];
}
