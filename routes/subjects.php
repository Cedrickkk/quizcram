<?php

use App\Http\Controllers\QuizController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

Route::prefix('/subjects')->group(function () {
  Route::get('/', [SubjectController::class, 'index'])->name('subjects.index');

  Route::post('/', [SubjectController::class, 'store'])->name('subjects.store');

  Route::get('/{subject}', [SubjectController::class, 'show'])->name('subjects.show');

  Route::get('/{subject}/quizzes', [SubjectController::class, 'quizzes'])->name('subjects.subject.quizzes');

  Route::post('/{subject}/quizzes/create-title', [QuizController::class, 'createTitle'])->name('subjects.quizzes.create-title');

  Route::post('/{subject}/quizzes', [QuizController::class, 'store'])->name('subjects.quizzes.store');

  Route::get('/{subject}/quizzes/{quiz}', [QuizController::class, 'show'])->name('subjects.quizzes.quiz.show');

  Route::get('/{subject}/quizzes/{quiz}/create', [QuizController::class, 'create'])->name('subjects.quizzes.quiz.create');

  Route::get('/{subject}/quizzes/{quiz}/questions', [QuizController::class, 'showQuestions'])->name('subjects.quizzes.quiz.questions.show');

  Route::post('/{subject}/quizzes/{quiz}/questions', [QuizController::class, 'saveQuestions'])->name('subjects.quizzes.quiz.questions');

  Route::get('/{subject}/quizzes/{quiz}/take', [QuizController::class, 'takeQuiz'])
    ->name('subjects.quizzes.quiz.take');

  Route::patch('/{subject}/quizzes/{quiz}/questions/{question}', [QuizController::class, 'updateQuestion'])
    ->name('subjects.quizzes.quiz.questions.update');

  Route::delete('/{subject}/quizzes/{quiz}/questions/{question}', [QuizController::class, 'deleteQuestion'])
    ->name('subjects.quizzes.quiz.questions.delete');

  Route::post('/archive/{subject}', [SubjectController::class, 'archive'])->name('subjects.archive');

  Route::post('/subjects/{subject}/quizzes/{quiz}/submit', [QuizController::class, 'submitQuiz'])
    ->name('subjects.quizzes.submit');

  Route::get('/subjects/{subject}/quizzes/{quiz}/results', [QuizController::class, 'quizResults'])
    ->name('subjects.quizzes.results');
});
