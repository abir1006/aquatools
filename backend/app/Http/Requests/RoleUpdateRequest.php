<?php

namespace App\Http\Requests;

use App\Rules\Name;
use Illuminate\Foundation\Http\FormRequest;

class RoleUpdateRequest extends FormRequest
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
            'name' => [
                'required',
                'max:255',
                'unique:roles,name,'.$this->id,
                new Name()
            ],
            'slug' => 'required|alpha_dash|max:255|unique:roles,slug,'.$this->id,
            'id' => 'required|integer'
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
