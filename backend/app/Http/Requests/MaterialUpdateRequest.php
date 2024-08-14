<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class MaterialUpdateRequest extends FormRequest
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
            'category_id' => 'required',
            'title' => 'required',
            'id' => 'required|integer',
            //'resources.*' => 'required|mimes:jpeg,png,jpg,gif,svg,doc,pdf,docx,zip|max:2048',

        ];
    }

    public function messages()
    {
        return [];
        /*  return [
            'id.required' => 'An id is required'
        ];*/
    }
    protected function failedValidation(Validator $validator)
    {

        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
