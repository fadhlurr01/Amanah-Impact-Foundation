<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? '',
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'amil',
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
            'is_demo' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registrasi pengurus berhasil. Selamat datang di portal Amanah!',
            'user' => [
                'id' => (string)$user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'avatarUrl' => $user->avatar_url,
                'isDemo' => $user->is_demo,
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi tidak cocok. Silakan periksa kembali.',
            ], 401);
        }

        $passwordMatches = false;
        try {
            if (str_starts_with((string)$user->password, '$2y$') || str_starts_with((string)$user->password, '$2a$') || str_starts_with((string)$user->password, '$2b$')) {
                $passwordMatches = Hash::check($validated['password'], $user->password);
            } else {
                $passwordMatches = ($validated['password'] === $user->password || md5($validated['password']) === $user->password);
                if ($passwordMatches) {
                    $user->password = Hash::make($validated['password']);
                    $user->save();
                }
            }
        } catch (\Throwable $e) {
            $passwordMatches = ($validated['password'] === $user->password);
        }

        if (!$passwordMatches) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau kata sandi tidak cocok. Silakan periksa kembali.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'user' => [
                'id' => (string)$user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'avatarUrl' => $user->avatar_url,
                'isDemo' => (bool)$user->is_demo,
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string|max:255',
            'newEmail' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'avatarUrl' => 'nullable|string',
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        }

        if (!empty($validated['name'])) $user->name = $validated['name'];
        if (!empty($validated['newEmail'])) $user->email = strtolower(trim($validated['newEmail']));
        if (!empty($validated['phone'])) $user->phone = $validated['phone'];
        if (!empty($validated['avatarUrl'])) $user->avatar_url = $validated['avatarUrl'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'user' => [
                'id' => (string)$user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'avatarUrl' => $user->avatar_url,
                'isDemo' => (bool)$user->is_demo,
            ]
        ]);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'oldPassword' => 'required|string',
            'newPassword' => 'required|string|min:6',
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();
        if (!$user || !Hash::check($validated['oldPassword'], $user->password)) {
            return response()->json(['success' => false, 'message' => 'Kata sandi lama salah.'], 400);
        }

        $user->password = Hash::make($validated['newPassword']);
        $user->save();

        return response()->json(['success' => true, 'message' => 'Kata sandi berhasil diubah.']);
    }
}
