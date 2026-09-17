<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationInfo extends Model
{
    use HasFactory;

    protected $table = 'organization_info';

    protected $fillable = [
        'name',
        'slug',
        'phone',
        'email',
        'address',
        'sk_kemenkumham',
        'npwp',
        'dinsos_reg',
        'description',
    ];
}
