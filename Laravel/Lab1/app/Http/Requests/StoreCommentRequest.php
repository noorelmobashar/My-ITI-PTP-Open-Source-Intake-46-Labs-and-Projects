<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'min:3'],
            'user_id' => ['required', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'The content field is required.',
            'content.min' => 'The content must be at least 3 characters.',
            'user_id.required' => 'The user_id field is required.',
            'user_id.exists' => 'The selected user_id is invalid.',
        ];
    }
}
