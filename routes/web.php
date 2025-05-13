<?php

use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::inertia('/', 'auth/welcome')->name('home');

    Route::inertia('/about', 'auth/about')->name('about');

    Route::inertia('/how-it-works', 'auth/how-it-works')->name('how-it-works');

    Route::inertia('/features', 'auth/features')->name('features');
});

Route::middleware(['auth', 'verified'])->group(function () {
    require __DIR__ . '/subjects.php';
    require __DIR__ . '/favorites.php';
    require __DIR__ . '/recent-quizzes.php';
    require __DIR__ . '/archives.php';
    require __DIR__ . '/analytics.php';
    require __DIR__ . '/quiz-settings.php';
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
