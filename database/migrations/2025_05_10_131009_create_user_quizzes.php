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
        Schema::create('user_quizzes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('quiz_id');
            $table->foreign('quiz_id')->references('id')->on('quizzes');
            $table->unsignedInteger('attempt_number')->nullable(false)->default(1);
            $table->decimal('score', 5, 2)->default(0);
            $table->unsignedInteger('total_questions_answered')->default(0);
            $table->unsignedInteger('time_spent')->default(0);
            $table->timestamp('started_at')->default(now());
            $table->timestamp('completed_at');
            $table->timestamps();
        });

        Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_quiz_id');
            $table->foreign('user_quiz_id')->references('id')->on('user_quizzes');
            $table->unsignedBigInteger('question_id');
            $table->foreign('question_id')->references('id')->on('questions');
            $table->unsignedBigInteger('selected_option_id');
            $table->foreign('selected_option_id')->references('id')->on('answer_options');
            $table->text('short_answer_text')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->unsignedInteger('time_spent')->default(0);
            $table->timestamp('answered_at')->default(now());
            $table->timestamps();
        });
    }
};
