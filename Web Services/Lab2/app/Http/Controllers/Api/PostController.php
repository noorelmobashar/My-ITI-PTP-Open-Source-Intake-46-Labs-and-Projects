<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $posts = Post::with('user:id,name,email')->latest()->get();

        return $this->successResponse($posts, 'Posts retrieved successfully');
    }

    public function show($id)
    {
        $post = Post::with('user:id,name,email')->find($id);

        if (!$post) {
            return $this->errorResponse('Post not found', 404);
        }

        return $this->successResponse($post, 'Post retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'required|string|min:5',
            'content' => 'required|string',
        ]);

        $post = $request->user()->posts()->create($validated);

        return $this->successResponse(
            $post->load('user:id,name,email'),
            'Post created successfully',
            201
        );
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return $this->errorResponse('Post not found', 404);
        }

        if ($post->user_id !== $request->user()->id) {
            return $this->errorResponse('Forbidden', 403);
        }

        $validated = $request->validate([
            'title'   => 'sometimes|required|string|min:5',
            'content' => 'sometimes|required|string',
        ]);

        $post->update($validated);

        return $this->successResponse(
            $post->fresh()->load('user:id,name,email'),
            'Post updated successfully'
        );
    }
    public function destroy(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return $this->errorResponse('Post not found', 404);
        }

        if ($post->user_id !== $request->user()->id) {
            return $this->errorResponse('Forbidden', 403);
        }

        $post->delete();

        return $this->successResponse(null, 'Post deleted successfully');
    }
}
