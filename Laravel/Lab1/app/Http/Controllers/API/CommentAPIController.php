<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;

class CommentAPIController extends Controller
{
    public function index(Post $post)
    {
        return CommentResource::collection($post->comments()->with('user')->orderBy('id')->get());
    }

    public function store(StoreCommentRequest $request, Post $post)
    {
        $comment = $post->comments()->create($request->validated());

        return new CommentResource($comment->load('user'));
    }

    public function show(Comment $comment)
    {
        return new CommentResource($comment->load('user'));
    }
}
