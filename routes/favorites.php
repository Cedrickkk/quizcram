<?php

use App\Http\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('/favorites')->group(function () {
  Route::get('/', [FavoriteController::class, 'index'])->name('favorite.index');
  Route::post('/toggle/{subject}', [FavoriteController::class, 'toggle'])->name('favorite.toggle');
});
