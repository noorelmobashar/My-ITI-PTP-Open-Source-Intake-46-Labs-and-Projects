<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('it displays comments on the post show page', function () {
    $post = Post::factory()->create();
    $comment = Comment::factory()->for($post)->for(User::factory())->create();

    $response = $this->get(route('posts.show', ['slug' => $post->slug]));

    $response->assertOk();
    $response->assertSee($comment->content);
    $response->assertSee($comment->user->name);
});

test('it stores a comment from the post show page', function () {
    $post = Post::factory()->create();
    $user = User::factory()->create();

    $response = $this->post(route('posts.comments.store', ['slug' => $post->slug]), [
        'content' => 'This is a new comment',
        'user_id' => $user->id,
    ]);

    $response->assertRedirect(route('posts.show', ['slug' => $post->slug]));

    $this->assertDatabaseHas('comments', [
        'content' => 'This is a new comment',
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
});

test('it returns post comments from the api', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();
    $comment = Comment::factory()->for($post)->for($user)->create();

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/posts/'.$post->id.'/comments');

    $response->assertOk();
    $response->assertJsonFragment([
        'id' => $comment->id,
        'content' => $comment->content,
    ]);
});
