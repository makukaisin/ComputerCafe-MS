<?php

use App\Http\Controllers\StationController;
use Illuminate\Support\Facades\Route;

Route::get('/stations', [StationController::class, 'index']);

Route::post('/stations', [StationController::class, 'store']);

Route::get('/stations/{station}', [
    StationController::class,
    'show'
]);