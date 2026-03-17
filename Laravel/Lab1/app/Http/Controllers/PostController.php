<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::query()
            ->orderBy('id')
            ->paginate(10);

        return view('posts.index', ['posts' => $posts]);
    }

    public function show($slug)
    {
        $post = Post::query()
            ->with(['user', 'comments.user'])
            ->where('slug', $slug)
            ->first();

        if (! $post) {
            return abort(404);
        }

        $commenters = User::all();

        return view('posts.show', ['post' => $post, 'commenters' => $commenters]);
    }

    public function create()
    {
        $creators = User::all();

        return view('posts.create', ['creators' => $creators]);
    }

    public function edit($slug)
    {
        $creators = User::all();
        $post = Post::where('slug', $slug)->first();
        if (! $post) {
            return abort(404);
        }

        return view('posts.edit', ['post' => $post, 'creators' => $creators]);
    }

    public function store(StorePostRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        Post::create($data);

        return to_route('posts.index');
    }

    public function update(StorePostRequest $request, $slug)
    {
        $post = Post::query()->where('slug', $slug)->firstOrFail();
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $data['image'] = $request->file('image')->store('images', 'public');
        } else {
            unset($data['image']);
        }

        $post->update($data);

        return to_route('posts.index');
    }

    public function destroy($slug)
    {
        $post = Post::query()->where('slug', $slug)->firstOrFail();

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return to_route('posts.index');
    }
}
