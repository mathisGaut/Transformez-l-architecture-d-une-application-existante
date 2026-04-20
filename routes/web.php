<?php

use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;

Route::get('/', function () {
    return view('welcome');
})->name('home');

/*
|--------------------------------------------------------------------------
| SPA React (API REST) — /app, /app/notes, …
|--------------------------------------------------------------------------
*/
Route::get('/app/{any?}', fn () => view('spa'))
    ->where('any', '.*')
    ->name('spa');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Volt::route('settings/profile', 'settings.profile')->name('settings.profile');
    Volt::route('settings/password', 'settings.password')->name('settings.password');
    Volt::route('settings/appearance', 'settings.appearance')->name('settings.appearance');
    Route::view('/notes', 'dashboard');
    Route::view('/tags', 'dashboard');
});

require __DIR__.'/auth.php';
