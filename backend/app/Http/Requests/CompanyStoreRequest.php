<?php

namespace App\Http\Requests;

use App\Rules\Name;
use App\Rules\Password;
use App\Rules\ContactNumber;
use App\Rules\ZipCode;
use Illuminate\Foundation\Http\FormRequest;

class CompanyStoreRequest extends FormRequest
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
                'max:100',
                'unique:companies'
            ],
            'email' => 'required|email|max:255|unique:companies',
            'contact_person' => [
                'required',
                'max:100'
            ],
            'address_line_1' => 'required',
            'type' => 'required|string|max:20',
            'currency' => 'required|string|max:20',
            'number_of_licence' => 'required|integer',
            'auth0_org_id' => 'unique:companies',
            'user_create' => 'required|boolean',
            'country' => 'max:50',
            'state' => 'max:50',
            'city' => 'max:50',
            'password' => [
                'exclude_unless:user_create,1',
                'min:6',
                'confirmed',
                new Password()
            ],
            'contact_number' => [
                'required',
                'max:20',
                new ContactNumber()
            ],
            'zip_code' => [
                'required',
                new ZipCode()
            ]
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}
