<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    private function mapTestimonial($t)
    {
        return [
            'id' => $t->id,
            'name' => $t->name,
            'role' => $t->role,
            'content' => $t->content,
            'message' => $t->message ?: $t->content,
            'avatarUrl' => $t->avatar_url,
            'location' => $t->location,
            'rating' => (int)$t->rating,
            'type' => $t->type,
        ];
    }

    public function index()
    {
        $testimonials = Testimonial::all()->map(function($t) {
            return $this->mapTestimonial($t);
        });
        return response()->json($testimonials);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'content' => 'required|string',
            'rating' => 'nullable|integer',
            'type' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        $num = Testimonial::count() + 1;
        $id = 'T-' . str_pad((string)$num, 2, '0', STR_PAD_LEFT);

        $testimonial = Testimonial::create([
            'id' => $id,
            'name' => $validated['name'],
            'role' => $validated['role'],
            'content' => $validated['content'],
            'message' => $validated['content'],
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
            'location' => $validated['location'] ?? 'Indonesia',
            'rating' => $validated['rating'] ?? 5,
            'type' => $validated['type'] ?? 'beneficiary',
        ]);

        return response()->json($this->mapTestimonial($testimonial), 201);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::find($id);
        if (!$testimonial) {
            return response()->json(['message' => 'Testimoni tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'rating' => 'nullable|integer',
            'type' => 'nullable|string',
            'location' => 'nullable|string',
            'avatarUrl' => 'nullable|string',
        ]);

        if (isset($validated['content'])) {
            $validated['message'] = $validated['content'];
        }
        if (isset($validated['avatarUrl'])) {
            $validated['avatar_url'] = $validated['avatarUrl'];
            unset($validated['avatarUrl']);
        }

        $testimonial->update(array_filter($validated, fn($val) => !is_null($val)));
        return response()->json($this->mapTestimonial($testimonial));
    }

    public function destroy($id)
    {
        $testimonial = Testimonial::find($id);
        if (!$testimonial) {
            return response()->json(['message' => 'Testimoni tidak ditemukan.'], 404);
        }
        $testimonial->delete();
        return response()->json(['message' => 'Testimoni berhasil dihapus.']);
    }
}
