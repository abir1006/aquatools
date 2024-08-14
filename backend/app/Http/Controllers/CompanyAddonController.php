<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyAddonStoreRequest;
use App\Http\Requests\CompanyAddonUpdateRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Services\CompanyAddonService;
use Illuminate\Http\Request;
use Config;

class CompanyAddonController extends Controller
{
    protected $companyAddonservice;


    public function __construct(CompanyAddonService $companyAddonservice)
    {
        $this->companyAddonService = $companyAddonservice;
    }

    public function list(Request $request)
    {
        $companyAddons = $this->companyAddonService->list($request->all());

        return response()->json($companyAddons, 200);
    }

    public function store(CompanyAddonStoreRequest $request)
    {
        $companyAddon = $this->companyAddonService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $companyAddon
        ], 201);
    }

    public function update(CompanyAddonUpdateRequest $request)
    {
        $companyAddon = $this->companyAddonService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $companyAddon
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $this->companyAddonService->delete($request->id);

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }

    public function changeStatus(StatusUpdateRequest $request)
    {
        $this->companyAddonService->changeStatus($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }


}
