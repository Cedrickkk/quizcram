<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('/analytics')->group(function () {
  Route::get('/', function () {
    return Inertia::render('analytics/index');
  });
});
