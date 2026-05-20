<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyCar extends Model
{
    protected $fillable = [
        'user_id',
        'model',
    ];

    public function insurance()
    {
        return $this->hasOne(InsurancePolicy::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
