<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'slug',
        'category',
        'author',
        'status',
        'excerpt',
        'content',
        'language',
        'published_date',
        'image_url',
        'thumbnail_url',
        'user_email',
        'is_demo',
    ];

    protected $casts = [
        'is_demo' => 'boolean',
        'published_date' => 'date',
    ];
}
