<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModuleStoreRequest extends FormRequest
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
            'name' => 'required|max:100|unique:modules',
            'slug' => 'required|alpha_dash|max:100|unique:modules',
            'tool_id' => 'required|integer'
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
