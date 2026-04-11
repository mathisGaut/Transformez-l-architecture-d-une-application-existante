<?php

/**
 * API REST (Étape 3) — usage basique :
 *
 * 1) POST /api/login  JSON : { "email", "password" }  →  { "token", "token_type", "user" }
 * 2) En-tête suivant : Authorization: Bearer <token>
 * 3) GET /api/user, /api/notes, /api/tags, etc.
 * 4) POST /api/logout pour invalider ce token
 */

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy'])->whereNumber('id');

    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/tags', [TagController::class, 'store']);
});
