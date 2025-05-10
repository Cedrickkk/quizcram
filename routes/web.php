<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');

    Route::get('/how-it-works', function () {
        return Inertia::render('how-it-works');
    })->name('how-it-works');

    Route::get('/about', function () {
        return Inertia::render('about');
    })->name('about');

    Route::get('/features', function () {
        return Inertia::render('features');
    })->name('features');
});




Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
