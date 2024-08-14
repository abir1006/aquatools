<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyToolStoreRequest;
use App\Http\Requests\CompanyToolUpdateRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Services\CompanyToolService;
use Illuminate\Http\Request;
use Config;

class CompanyToolController extends Controller
{
    protected $companyToolservice;


    public function __construct(CompanyToolService $companyToolservice)
    {
        $this->companyToolService = $companyToolservice;
    }

    public function list(Request $request)
    {
        $companyTools = $this->companyToolService->list($request->all());

        return response()->json($companyTools, 200);
    }

    public function store(CompanyToolStoreRequest $request)
    {
        $CompanyTool = $this->companyToolService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $CompanyTool
        ], 201);
    }

    public function update(CompanyToolUpdateRequest $request)
    {
        $CompanyTool = $this->companyToolService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $CompanyTool
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $this->companyToolService->delete($request->id);

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }

    public function changeStatus(StatusUpdateRequest $request)
    {
        $this->companyToolService->changeStatus($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }


}
