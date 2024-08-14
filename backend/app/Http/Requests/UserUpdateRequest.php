<?php

namespace App\Http\Requests;

use App\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
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
            'email' => 'required|max:255|unique:users,email,' . $this->id,
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'company_id' => 'required|integer',
            'role_id' => 'required|integer',
            'status' => 'required|integer',
            'id' => 'required|integer',
            'password' => [
                'sometimes',
                'min:6',
                'confirmed',
                new Password()
            ]
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
