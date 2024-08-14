<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlockInputStoreRequest extends FormRequest
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
            'slug' => 'required|alpha_dash|max:100|unique:block_inputs',
            'block_id' => 'required|integer',
            'company_id' => 'nullable|array',
            'range_slider' => 'nullable|boolean',
            'default_data' => 'nullable|numeric',
            'min_value' => 'nullable|numeric',
            'max_value' => 'nullable|numeric',
            'divided_by' => 'nullable|numeric'
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
