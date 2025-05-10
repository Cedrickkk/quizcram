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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->nullable(false);
            $table->enum('question_order', ['sequential', 'random'])->nullable(false)->default('sequential');
            $table->enum('display_format', ['one_per_page', 'all_on_page'])->nullable(false)->default('one_per_page');
            $table->boolean('show_question_number')->nullable(false)->default(true);
            $table->boolean('visible_timer')->nullable(false)->default(true);
            $table->boolean('question_required')->nullable(false)->default(true);
            $table->enum('show_correct_answers', ['immediately', 'after_quiz'])->nullable(false)->default('after_quiz');
            $table->unsignedInteger('passing_threshold')->nullable(false)->default(70);
            $table->unsignedInteger('time_duration')->default(900);
            $table->unsignedInteger('max_attempts')->nullable();
            $table->timestamps();
        });
    }
};
