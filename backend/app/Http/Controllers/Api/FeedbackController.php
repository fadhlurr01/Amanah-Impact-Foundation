<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::orderBy('created_at', 'desc')->get();
        return response()->json($feedbacks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'category' => 'nullable|string',
            'message' => 'required|string',
            'name' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $feedback = Feedback::create([
            'name' => $validated['name'] ?? 'Anonim',
            'email' => $validated['email'] ?? '',
            'rating' => $validated['rating'],
            'category' => $validated['category'] ?? 'Fitur Baru',
            'message' => $validated['message'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback berhasil dikirimkan. Terima kasih atas masukan Anda!',
            'data' => $feedback,
        ], 201);
    }

    public function destroy($id)
    {
        $feedback = Feedback::find($id);
        if (!$feedback) {
            return response()->json(['message' => 'Feedback tidak ditemukan.'], 404);
        }
        $feedback->delete();
        return response()->json(['message' => 'Feedback berhasil dihapus.']);
    }
}
