<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlockUpdateRequest extends FormRequest
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
            'name' => 'required|max:100',
            'slug' => 'alpha_dash|max:100|unique:blocks,slug,'. $this->id,
            //'tool_id' => 'required|integer',
            'is_default' => 'required|boolean',
            'case_type' => 'nullable|max:50',
            'column_no' => 'nullable|integer',
            'has_cases' => 'nullable|boolean',
            'id' => 'required|integer'

        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
