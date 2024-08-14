<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceStoreRequest;
use App\Http\Requests\InvoiceUpdateRequest;
use App\Http\Requests\SendRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Config;

class InvoiceController extends Controller
{
    protected $invoiceService;


    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function list(Request $request)
    {
        $invoices = $this->invoiceService->list($request->all());

        return response()->json($invoices, 200);
    }

    public function store(InvoiceStoreRequest $request)
    {
        $invoice = $this->invoiceService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $invoice
        ], 201);
    }

    public function update(InvoiceUpdateRequest $request)
    {
        $invoice = $this->invoiceService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $invoice
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $this->invoiceService->delete($request->id);

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }

    public function changeStatus(StatusUpdateRequest $request)
    {
        $this->invoiceService->changeStatus($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }

    public function send(SendRequest $request)
    {
        $this->invoiceService->send($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }


}
