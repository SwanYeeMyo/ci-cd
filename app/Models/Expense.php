<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'amount',
        'category',
        'date',
        'with_girlfriend',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
        'with_girlfriend' => 'boolean',
    ];
}
