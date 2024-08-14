<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class TemplateStoreRequest extends FormRequest
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
            'name' => 'required|max:100|unique:templates',
            'tool_id' => 'required|integer',
            'user_id' => 'required|integer',
            'template_data' => 'nullable',
            'type' => 'nullable|max:100'
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
