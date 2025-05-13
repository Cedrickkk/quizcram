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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('subject_id');
            $table->foreign('subject_id')->references('id')->on('subjects');
            $table->string('title')->nullable(false);
            $table->unsignedInteger('time_duration')->nullable();
            $table->unsignedInteger('max_attempts')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });

        Schema::create('quiz_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quiz_id');
            $table->foreign('quiz_id')->references('id')->on('quizzes');
            $table->boolean('use_default_settings')->default(true);
            $table->enum('question_order', ['sequential', 'random'])->nullable();
            $table->enum('display_format', ['one_per_page', 'all_on_page'])->nullable();
            $table->boolean('show_question_number')->nullable();
            $table->boolean('visible_timer')->nullable();
            $table->boolean('question_required')->nullable();
            $table->enum('show_correct_answers', ['immediately', 'after_quiz'])->nullable();
            $table->unsignedInteger('passing_threshold')->nullable();
            $table->timestamps();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quiz_id');
            $table->foreign('quiz_id')->references('id')->on('quizzes');
            $table->text('text')->nullable(false);
            $table->enum('type', ['multiple_choice', 'true_or_false', 'short_answer'])->nullable(false);
            $table->unsignedInteger('points')->nullable(false)->default(1);
            $table->unsignedInteger('order_number')->nullable(false);
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('answer_options', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_id');
            $table->foreign('question_id')->references('id')->on('questions');
            $table->string('text')->nullable(false);
            $table->boolean('is_correct')->nullable(false);
            $table->unsignedInteger('order_number')->nullable(false);
            $table->timestamps();
        });
    }
};
