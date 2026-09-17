<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\BlogPost;
use App\Models\User;

class BlogController extends Controller
{
    private function mapBlog($b)
    {
        return [
            'id' => (string)$b->id,
            'title' => $b->title,
            'slug' => $b->slug,
            'category' => $b->category ?? 'Edukasi',
            'author' => $b->author ?? 'Tim Media Amanah',
            'status' => $b->status ?? 'published',
            'excerpt' => $b->excerpt ?? '',
            'content' => $b->content ?? '',
            'language' => $b->language ?? 'id',
            'publishedDate' => $b->published_date ? (is_string($b->published_date) ? substr($b->published_date, 0, 10) : $b->published_date->format('Y-m-d')) : null,
            'imageUrl' => $b->image_url,
            'thumbnailUrl' => $b->thumbnail_url ?: $b->image_url,
            'userEmail' => $b->user_email ?? null,
            'userId' => $b->user_id ?? null,
            'isDemo' => (bool)$b->is_demo,
        ];
    }

    public function index(Request $request)
    {
        $userEmail = $request->query('user_email');
        $isAdmin = filter_var($request->query('is_admin'), FILTER_VALIDATE_BOOLEAN);

        $query = BlogPost::query();
        if ($userEmail && $isAdmin) {
            $user = User::where('email', strtolower(trim($userEmail)))->first();
            if ($user && !$user->is_demo) {
                if (Schema::hasColumn('blog_posts', 'user_email')) {
                    $query->where('user_email', $userEmail)->where('is_demo', false);
                } elseif (Schema::hasColumn('blog_posts', 'user_id')) {
                    $query->where('user_id', $user->id)->where('is_demo', false);
                }
            }
        }

        $orderCol = Schema::hasColumn('blog_posts', 'published_date') ? 'published_date' : 'id';
        $blogs = $query->orderBy($orderCol, 'desc')->get()->map(function($b) {
            return $this->mapBlog($b);
        });

        return response()->json($blogs);
    }

    public function show($slug)
    {
        $blog = BlogPost::where('slug', $slug)->orWhere('id', $slug)->first();
        if (!$blog) {
            return response()->json(['message' => 'Artikel tidak ditemukan.'], 404);
        }
        return response()->json($this->mapBlog($blog));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'author' => 'nullable|string',
            'imageUrl' => 'nullable|string',
            'userEmail' => 'nullable|string',
        ]);

        $num = BlogPost::count() + 1;
        $id = 'B-' . str_pad((string)$num, 2, '0', STR_PAD_LEFT);
        $slug = Str::slug($validated['title']) . '-' . strtolower(Str::random(4));

        $userEmail = $validated['userEmail'] ?? 'admin@amanah.org';
        $user = User::where('email', $userEmail)->first();
        $isDemo = $user ? (bool)$user->is_demo : true;

        $blogData = [
            'id' => $id,
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'] ?? 'Edukasi',
            'author' => $validated['author'] ?? 'Tim Media Amanah',
            'status' => 'published',
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'language' => 'id',
            'published_date' => now()->format('Y-m-d'),
            'image_url' => $validated['imageUrl'] ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
            'thumbnail_url' => $validated['imageUrl'] ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
            'is_demo' => $isDemo,
        ];

        if (Schema::hasColumn('blog_posts', 'user_email')) {
            $blogData['user_email'] = $userEmail;
        }
        if (Schema::hasColumn('blog_posts', 'user_id')) {
            $blogData['user_id'] = $user ? $user->id : 'usr-admin-demo';
        }

        $blog = BlogPost::create($blogData);

        return response()->json($this->mapBlog($blog), 201);
    }

    public function update(Request $request, $id)
    {
        $blog = BlogPost::where('id', $id)->orWhere('slug', $id)->first();
        if (!$blog) {
            return response()->json(['message' => 'Artikel tidak ditemukan.'], 404);
        }

        $data = $request->all();
        if (isset($data['title'])) $blog->title = $data['title'];
        if (isset($data['category'])) $blog->category = $data['category'];
        if (isset($data['excerpt'])) $blog->excerpt = $data['excerpt'];
        if (isset($data['content'])) $blog->content = $data['content'];
        if (isset($data['author'])) $blog->author = $data['author'];
        if (isset($data['imageUrl'])) {
            $blog->image_url = $data['imageUrl'];
            $blog->thumbnail_url = $data['imageUrl'];
        }
        $blog->save();

        return response()->json($this->mapBlog($blog));
    }

    public function destroy($id)
    {
        $blog = BlogPost::where('id', $id)->orWhere('slug', $id)->first();
        if (!$blog) {
            return response()->json(['message' => 'Artikel tidak ditemukan.'], 404);
        }
        $blog->delete();
        return response()->json(['message' => 'Artikel berhasil dihapus.']);
    }
}
