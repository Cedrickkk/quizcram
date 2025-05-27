<?php

use App\Models\UserQuiz;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('recent-quizzes')->group(function () {
  Route::get('/', function () {
    // Get recent quizzes taken by the current user
    $recentQuizzes = UserQuiz::where('user_id', Auth::id())
      ->with(['quiz.subject', 'quiz.questions'])
      ->orderBy('created_at', 'desc')
      ->limit(10)
      ->get()
      ->map(function ($userQuiz) {
        return [
          'id' => $userQuiz->id,
          'quiz_id' => $userQuiz->quiz_id,
          'subject_id' => $userQuiz->quiz->subject_id,
          'title' => $userQuiz->quiz->title,
          'score' => $userQuiz->score,
          'questions_count' => $userQuiz->quiz->questions->count(),
          'time_spent' => $userQuiz->time_spent,
          'time_duration' => $userQuiz->quiz->time_duration,
          'completed_at' => $userQuiz->completed_at,
          'attempt_number' => $userQuiz->attempt_number,
          'subject_title' => $userQuiz->quiz->subject->title,
        ];
      });

    return Inertia::render('recent-quizzes/index', [
      'recent' => $recentQuizzes
    ]);
  });
});
