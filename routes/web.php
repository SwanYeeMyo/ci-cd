<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SavingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'laravelVersion' => app()->version(),
        'phpVersion' => PHP_VERSION,
    ]);
});

// Users Routes
Route::get('users', [UserController::class, 'index'])->name('users.index');

// Expenses Routes
Route::get('expenses', [ExpenseController::class, 'index'])->name('expenses.index');
Route::post('expenses', [ExpenseController::class, 'store'])->name('expenses.store');
Route::delete('expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
Route::get('girlfriend-expenses', [ExpenseController::class, 'girlfriendIndex'])->name('expenses.girlfriend');

// Savings & Reports Routes
Route::get('savings', [SavingsController::class, 'index'])->name('savings.index');
Route::post('savings', [SavingsController::class, 'updateOrCreate'])->name('savings.store');


