<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignUpdate extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'campaign_slug',
        'title',
        'date',
        'description',
        'image_url',
        'amount_spent',
    ];

    protected $casts = [
        'amount_spent' => 'float',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_slug', 'slug');
    }
}
