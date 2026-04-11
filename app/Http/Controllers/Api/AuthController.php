<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Connexion : reçoit email + mot de passe, renvoie un token Bearer Sanctum.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $tokenName = $request->input('device_name', 'front');
        $plainToken = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'token' => $plainToken,
            'token_type' => 'Bearer',
            'user' => $user->only(['id', 'name', 'email']),
        ]);
    }

    /**
     * Utilisateur connecté (vérifie que le token est valide).
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user()->only(['id', 'name', 'email']));
    }

    /**
     * Révoque le token utilisé pour cette requête.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'OK']);
    }
}
