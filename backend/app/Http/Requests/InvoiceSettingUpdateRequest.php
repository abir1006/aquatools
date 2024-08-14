<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceSettingUpdateRequest extends FormRequest
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
            'type' => 'required|unique:invoice_settings,type,' . $this->id . ',id,currency,' . $this->currency,
            'currency' => 'required|max:15',
            'id' => 'required|integer',
            'status' => 'integer',
            'genetics_price' => 'required|numeric|min:0',
            'optimalisering_price' => 'required|numeric|min:0',
            'cost_of_disease_price' => 'required|numeric|min:0',
            'vaksinering_price' => 'required|numeric|min:0',
            'mtb_price' => 'required|numeric|min:0',
            'kn_for_price' => 'required|numeric|min:0',
            'slaktmodel_price' => 'required|numeric|min:0',
            'custom_report_price' => 'required|numeric|min:0',
            'save_template_price' => 'required|numeric|min:0',
            'download_template_price' => 'required|numeric|min:0',
            'share_template_price' => 'required|numeric|min:0',
            'save_cod_price' => 'required|numeric|min:0',
            'price_per_user' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'unique' => 'Same currency and duration has already been taken'
        ];
    }
}
