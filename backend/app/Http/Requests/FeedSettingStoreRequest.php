<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FeedSettingStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|unique:feed_settings'
        ];
    }

    public function messages()
    {
        return [
            'unique' => 'Same settings name has already been taken'
        ];
    }
}
