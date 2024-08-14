<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModuleUpdateRequest extends FormRequest
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
            'name' => 'required|max:100|unique:modules,name,'. $this->id,
            'slug' => 'alpha_dash|max:100|unique:modules,slug,'. $this->id,
            'tool_id' => 'integer',
            'id' => 'required|integer'

        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
