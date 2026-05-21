<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyBudget extends Model
{
    use HasFactory;

    protected $fillable = [
        'month',
        'income',
        'saving_goal',
    ];

    protected $casts = [
        'income' => 'decimal:2',
        'saving_goal' => 'decimal:2',
    ];
}
