<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
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
        'skills',
        'interest_area',
        'availability',
        'experience',
        'status',
        'registered_date',
        'is_demo',
    ];

    protected $casts = [
        'skills' => 'array',
        'is_demo' => 'boolean',
    ];
}
