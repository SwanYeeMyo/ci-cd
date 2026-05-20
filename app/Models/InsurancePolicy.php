<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InsurancePolicy extends Model
{
    protected $fillable = [
        'company_car_id',
        'provider',
    ];

    public function companyCar()
    {
        return $this->belongsTo(CompanyCar::class);
    }
}
