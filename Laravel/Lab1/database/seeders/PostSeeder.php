<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::truncate();

        $users = User::factory()->count(50)->create();

        Post::factory()
            ->count(500)
            ->recycle($users)
            ->create();
    }
}
