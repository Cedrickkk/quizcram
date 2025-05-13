<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('recent-quizzes')->group(function () {
  Route::get('/', function () {
    return Inertia::render('recent-quizzes/index');
  });
});
