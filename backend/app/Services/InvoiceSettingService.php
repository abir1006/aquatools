<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\InvoiceSetting;
use Config;

class InvoiceSettingService
{

    public function __construct()
    {
    }

    public function list()
    {
        return InvoiceSetting::orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(
            Config::get('settings.pagination.per_page')
        );
    }

    public function currencyDropdown()
    {
        return Config::get('settings.dropdown.currency');
    }

    public function subscriptionDurationDropdown()
    {
        return Config::get('settings.dropdown.subscription_duration');
    }

    public function save($data)
    {
        $tool_price = [
            'genetics_price' => $data['genetics_price'],
            'optimalisering_price' => $data['optimalisering_price'],
            'cost_of_disease_price' => $data['cost_of_disease_price'],
            'mtb_price' => $data['mtb_price'],
            'kn_for_price' => $data['kn_for_price'],
            'vaksinering_price' => $data['vaksinering_price'],
            'slaktmodel_price' => $data['slaktmodel_price']
        ];

        $add_on_price = [
            'custom_report_price' => $data['custom_report_price'],
            'save_template_price' => $data['save_template_price'],
            'download_template_price' => $data['download_template_price'],
            'share_template_price' => $data['share_template_price'],
            'save_cod_price' => $data['save_cod_price'],
        ];

        $user_price = [
            'price_per_user' => $data['price_per_user']
        ];

        $data['tool_price'] = $tool_price;
        $data['add_on_price'] = $add_on_price;
        $data['user_price'] = $user_price;
        $invoiceSetting = InvoiceSetting::create($data);
        return $this->formatData($invoiceSetting);
    }

    public function update($data)
    {
        $id = $data['id'];

        $tool_price = [
            'genetics_price' => $data['genetics_price'],
            'optimalisering_price' => $data['optimalisering_price'],
            'cost_of_disease_price' => $data['cost_of_disease_price'],
            'mtb_price' => $data['mtb_price'],
            'kn_for_price' => $data['kn_for_price'],
            'vaksinering_price' => $data['vaksinering_price'],
            'slaktmodel_price' => $data['slaktmodel_price']
        ];

        $add_on_price = [
            'custom_report_price' => $data['custom_report_price'],
            'save_template_price' => $data['save_template_price'],
            'download_template_price' => $data['download_template_price'],
            'share_template_price' => $data['share_template_price'],
            'save_cod_price' => $data['save_cod_price'],
        ];

        $user_price = [
            'price_per_user' => $data['price_per_user']
        ];

        $data['tool_price'] = $tool_price;
        $data['add_on_price'] = $add_on_price;
        $data['user_price'] = $user_price;


        InvoiceSetting::findOrFail($id)->update($data);
        $invoiceSetting = InvoiceSetting::find($id);
        return $this->formatData($invoiceSetting);
    }

    public function search($data)
    {
        $type = 2;
        $currency = 'NOK';

        if (!empty($data['type'])) {
            $type = $data['type'];
        }
        if (!empty($data['currency'])) {
            $currency = $data['currency'];
        }

        $invoiceSetting = InvoiceSetting::where('type', $type)
            ->where('currency', $currency)->first();

        return $this->formatData($invoiceSetting);
    }

    public function delete($id)
    {
        return InvoiceSetting::destroy($id);
    }

    public function formatData($invoiceSetting)
    {
        $invoice = [
            'id' => $invoiceSetting->id,
            'type' => $invoiceSetting->type,
            'currency' => $invoiceSetting->currency,
            'status' => $invoiceSetting->status,
            'updated_at' => $invoiceSetting->updated_at,
            'created_at' => $invoiceSetting->created_at
        ];
        $tool_price = json_decode($invoiceSetting->tool_price, true);
        $add_on_price = json_decode($invoiceSetting->add_on_price, true);
        $user_price = json_decode($invoiceSetting->user_price, true);

        return array_merge($invoice, $tool_price, $add_on_price, $user_price);
    }


}
