<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingsConfig extends Model
{
    protected $fillable = [
        'fixed_amount',
        'start_month',
    ];
}
