<?php

namespace App\Http\Requests;

use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $post = null;
        if ($this->route('slug')) {
            $post = Post::where('slug', $this->route('slug'))->first();
        }

        return [
            'title' => ['required', 'min:3', 'unique:posts,title,'.($post ? $post->id : 'NULL')],
            'description' => ['required', 'min:10'],
            'user_id' => ['required', 'exists:users,id'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The title field is required.',
            'title.min' => 'The title must be at least 3 characters.',
            'title.unique' => 'The title has already been taken.',
            'description.required' => 'The description field is required.',
            'description.min' => 'The description must be at least 10 characters.',
            'user_id.required' => 'The user_id field is required.',
            'user_id.exists' => 'The selected user_id is invalid.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, jpg, png.',
        ];
    }
}
