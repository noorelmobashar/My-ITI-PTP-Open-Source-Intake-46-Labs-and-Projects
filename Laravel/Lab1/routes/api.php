<?php

use App\Http\Controllers\API\CommentAPIController;
use App\Http\Controllers\API\PostAPIController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('posts', PostAPIController::class)->middleware('auth:sanctum')->names('api.posts');
Route::get('/posts/{post}/comments', [CommentAPIController::class, 'index'])->middleware('auth:sanctum')->name('api.posts.comments.index');
Route::post('/posts/{post}/comments', [CommentAPIController::class, 'store'])->middleware('auth:sanctum')->name('api.posts.comments.store');
Route::get('/comments/{comment}', [CommentAPIController::class, 'show'])->middleware('auth:sanctum')->name('api.comments.show');

Route::post('/sanctum/token', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    return $user->createToken($request->device_name)->plainTextToken;
});
