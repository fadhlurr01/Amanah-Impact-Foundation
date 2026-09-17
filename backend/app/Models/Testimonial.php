<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'role',
        'content',
        'message',
        'avatar_url',
        'location',
        'rating',
        'type',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}
