<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('/archives')->group(function () {
  Route::get('/', function () {
    return Inertia::render('archived/index');
  });
});
