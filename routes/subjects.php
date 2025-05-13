<?php

use App\Http\Controllers\QuizController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

Route::prefix('/subjects')->group(function () {
  Route::get('/', [SubjectController::class, 'index'])->name('subjects.index');

  Route::post('/', [SubjectController::class, 'store'])->name('subjects.store');

  Route::get('/{subject}', [SubjectController::class, 'show'])->name('subjects.show');

  Route::get('/{subject}/quizzes', [SubjectController::class, 'quizzes'])->name('subjects.quizzes');

  Route::post('/{subject}/quizzes', [QuizController::class, 'store'])->name('subjects.quizzes.create');

  Route::post('/archive/{subject}', [SubjectController::class, 'archive'])->name('subjects.archive');
});
