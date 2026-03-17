<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Post;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, $slug)
    {
        $post = Post::query()->where('slug', $slug)->firstOrFail();

        $post->comments()->create($request->validated());

        return to_route('posts.show', ['slug' => $post->slug]);
    }
}
