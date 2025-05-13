<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('/quiz-settings')->group(function () {
  Route::get('/', function () {
    return Inertia::render('quiz-settings/index');
  });
});
