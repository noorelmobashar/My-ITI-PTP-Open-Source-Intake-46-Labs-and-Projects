<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::query()
            ->orderBy('id')
            ->paginate(10);

        return view('posts.index', ['posts' => $posts]);
    }

    public function show($id)
    {
        $post = Post::find($id);
        if (! $post) {
            return abort(404);
        }

        return view('posts.show', ['post' => $post]);
    }

    public function create()
    {
        $creators = User::all();

        return view('posts.create', ['creators' => $creators]);
    }

    public function edit($id)
    {
        $creators = User::all();
        $post = Post::find($id);
        if (! $post) {
            return abort(404);
        }

        return view('posts.edit', ['post' => $post, 'creators' => $creators]);
    }

    public function store()
    {
        Post::create([
            'title' => request('title'),
            'description' => request('description'),
            'user_id' => request('user_id'),
        ]);

        return to_route('posts.index');
    }

    public function update()
    {
        $post = Post::query()->whereKey((int) request('id'))->firstOrFail();

        $post->update(request()->only(['title', 'description', 'user_id']));
        $post->save();

        return to_route('posts.index');
    }

    public function destroy($id)
    {
        Post::destroy($id);

        return to_route('posts.index');
    }
}
