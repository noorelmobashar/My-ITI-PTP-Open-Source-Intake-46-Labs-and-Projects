<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    private $post = [
        [
            'id' => 1,
            'title' => 'First Post',
            'description' => 'This is the first post description.',
            'creator' => [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com'
            ],
            'created_at' => '2024-06-01 10:00:00',
        ],
        [
            'id' => 2,
            'title' => 'Second Post',
            'description' => 'This is the second post description.',
            'creator' => [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com'
            ],
            'created_at' => '2024-06-01 10:00:00',
        ],
        [
            'id' => 3,
            'title' => 'Third Post',
            'description' => 'This is the third post description.',
            'creator' => [
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@example.com'
            ],
            'created_at' => '2024-06-01 10:00:00',
        ]
    ];

    public function index()
    {
        
        return view('posts.index', ['posts' => $this->post]);
    }

    public function show($id)
    {
        foreach ($this->post as $post) {
            if ($post['id'] == $id) {
                return view('posts.show', ['post' => $post]);
            }
        }
        return abort(404);
    }

    public function create()
    {
        $creators = [];
        foreach ($this->post as $posts)
        {
            array_push($creators, $posts['creator']);
        }
        return view('posts.create', ['creators' => $creators]);
    }

    public function edit($id)
    {
        $creators = [];
        foreach ($this->post as $posts)
        {
            array_push($creators, $posts['creator']);
        }
        foreach ($this->post as $post) {
            if ($post['id'] == $id) {
                return view('posts.edit', ['post' => $post, 'creators' => $creators]);
            }
        }
        return abort(404);
    }

    public function store()
    {
        return to_route('posts.index');
    }

    public function update($id)
    {
        return to_route('posts.index');
    }

    public function destroy($id)
    {
        return to_route('posts.index');
    }
}
