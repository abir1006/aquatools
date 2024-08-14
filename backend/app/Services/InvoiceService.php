<?php

namespace App\Services;

use App\Models\Invoice;
use Config;

class InvoiceService
{

    public function __construct()
    {

    }

    public function list()
    {
        return Invoice::orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(Config::get('settings.pagination.per_page'));
    }

    public function save($data)
    {
        return Invoice::create($data);
    }

    public function update($data)
    {
        $id = $data['id'];
        Invoice::findOrFail($id)->update($data);
        return Invoice::find($id);
    }

    public function delete($id)
    {
        return Invoice::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $is_sent = $data['is_sent'];

        $invoice = Invoice::findOrFail($id);
        $invoice->is_sent = $is_sent;
        $invoice->save();

        return $invoice;
    }

    public function send($data)
    {
        $id = $data['id'];
        $is_sent = $data['is_sent'];
        $sending_date = null;
        if($is_sent == 1){
            $sending_date = date('Y-m-d');
        }
        

        $invoice = Invoice::findOrFail($id);
        $invoice->is_sent = $is_sent;
        $invoice->sending_date = $sending_date;
        $invoice->save();

        return $invoice;
    }


}
