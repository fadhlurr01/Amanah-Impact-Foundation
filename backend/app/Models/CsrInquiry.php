<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CsrInquiry extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'company_name',
        'pic_name',
        'position',
        'email',
        'whatsapp',
        'website',
        'budget_range',
        'interested_program',
        'location_target',
        'message',
        'pipeline_status',
        'created_date',
        'is_demo',
    ];

    protected $casts = [
        'is_demo' => 'boolean',
        'created_date' => 'datetime',
    ];
}
