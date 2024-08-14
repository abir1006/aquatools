<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\InvoiceSettingStoreRequest;
use App\Http\Requests\InvoiceSettingUpdateRequest;
use App\Services\InvoiceSettingService;
use Illuminate\Http\Request;
use Config;

class InvoiceSettingController extends Controller
{
    protected $invoiceSettingService;


    public function __construct(InvoiceSettingService $invoiceSettingService)
    {
        $this->invoiceSettingService = $invoiceSettingService;
    }

    public function list(Request $request)
    {
        $invoiceSettings = $this->invoiceSettingService->list($request->all());

        return response()->json($invoiceSettings, 200);
    }

    public function currencyDropdown(Request $request)
    {
        $currencyList = $this->invoiceSettingService->currencyDropdown($request->all());

        return response()->json($currencyList, 200);
    }

    public function subscriptionDurationDropdown(Request $request)
    {
        $subscriptionDurationList = $this->invoiceSettingService->subscriptionDurationDropdown($request->all());

        return response()->json($subscriptionDurationList, 200);
    }

    public function store(InvoiceSettingStoreRequest $request)
    {
        $invoiceSetting = $this->invoiceSettingService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $invoiceSetting
        ], 201);
    }

    public function update(InvoiceSettingUpdateRequest $request)
    {
        $invoiceSetting = $this->invoiceSettingService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $invoiceSetting
        ], 201);
    }

    public function search(Request $request)
    {
        $invoiceSetting = $this->invoiceSettingService->search($request->all());

        return response()->json([
            'data' => $invoiceSetting
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->invoiceSettingService->delete($request->id);

        if($deleted == 0) {
            return response()->json([
                'message' => Config::get('settings.message.not_found')
            ], 404);
        }

        return response()->json([
                'message' => Config::get('settings.message.deleted')
            ], 200);
    }


}
