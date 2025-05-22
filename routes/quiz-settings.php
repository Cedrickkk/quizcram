<?php

use App\Http\Controllers\SystemSettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('/quiz-settings')->group(function () {

  Route::get('/', [SystemSettingController::class, 'index'])->name('quiz-settings.index');

  Route::post('/', [SystemSettingController::class, 'store'])->name('quiz-settings.store');

  Route::put('/{id}', [SystemSettingController::class, 'update'])->name('quiz-settings.update');
});
