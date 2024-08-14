<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TemplateRemoveShareRequest extends FormRequest
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
            'id' => 'required|integer'
//            'template_id' => 'required|integer',
//            'user_id' => 'required|integer',
            //'is_remove' => 'required|boolean',
        ];
    }

    public function messages()
    {
        return [

        ];
    }
}


