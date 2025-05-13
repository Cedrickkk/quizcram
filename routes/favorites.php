<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('/favorites')->group(function () {
  Route::get('/', function () {
    return Inertia::render('favorites/index');
  });
});
