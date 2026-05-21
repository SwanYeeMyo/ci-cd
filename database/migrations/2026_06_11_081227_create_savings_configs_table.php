<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('savings_configs', function (Blueprint $table) {
            $table->id();
            $table->decimal('fixed_amount', 15, 2)->default(0.00);
            $table->string('start_month'); // Format: Y-m
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_configs');
    }
};
