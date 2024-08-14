<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlockInputUpdateRequest extends FormRequest
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
            'slug' => 'alpha_dash|max:100|unique:block_inputs,slug,'. $this->id,
            'block_id' => 'nullable|integer',
            'company_id' => 'nullable|array',
            'default_data' => 'nullable|numeric',
            'range_slider' => 'nullable|boolean',
            'min_value' => 'nullable|numeric',
            'max_value' => 'nullable|numeric',
            'divided_by' => 'nullable|numeric',
            'id' => 'required|integer'
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
