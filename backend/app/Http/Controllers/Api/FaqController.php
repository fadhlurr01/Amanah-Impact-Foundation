<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        return response()->json($faqs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'nullable|string|max:100',
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $num = Faq::count() + 1;
        $id = 'F-' . str_pad((string)$num, 2, '0', STR_PAD_LEFT);

        $faq = Faq::create([
            'id' => $id,
            'category' => $validated['category'] ?? 'Umum',
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'is_demo' => 0,
        ]);

        return response()->json($faq, 201);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::find($id);
        if (!$faq) {
            return response()->json(['message' => 'FAQ tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'category' => 'nullable|string|max:100',
            'question' => 'nullable|string',
            'answer' => 'nullable|string',
        ]);

        $faq->update(array_filter($validated, fn($val) => !is_null($val)));
        return response()->json($faq);
    }

    public function destroy($id)
    {
        $faq = Faq::find($id);
        if (!$faq) {
            return response()->json(['message' => 'FAQ tidak ditemukan.'], 404);
        }
        $faq->delete();
        return response()->json(['message' => 'FAQ berhasil dihapus.']);
    }
}
