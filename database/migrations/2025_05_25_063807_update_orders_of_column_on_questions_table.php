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
        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'time_estimation')) {
                $table->dropColumn('time_estimation');
            }

            if (Schema::hasColumn('questions', 'required')) {
                $table->dropColumn('required');
            }

            $table->unsignedInteger('time_estimation')->nullable()->after('order_number');
            $table->boolean('required')->nullable()->default(true)->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
