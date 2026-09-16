<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stations', function (Blueprint $table) {

            $table->id();

            $table->string(
                'station_name',
                100
            );

            $table->string(
                'pc_number',
                50
            )->unique();

            $table->string(
                'tier',
                50
            );

            $table->decimal(
                'hourly_rate',
                8,
                2
            );

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stations');
    }
};