<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModuleStoreRequest;
use App\Http\Requests\ModuleUpdateRequest;
use App\Http\Requests\BlockListRequest;
use App\Http\Requests\SendRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Services\ModuleService;
use Illuminate\Http\Request;
use Config;

class ModuleController extends Controller
{
    protected $moduleService;


    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }

    public function list(BlockListRequest $request)
    {
        $modules = $this->moduleService->list($request->all());

        return response()->json($modules, 200);
    }

    public function store(ModuleStoreRequest $request)
    {
        $module = $this->moduleService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $module
        ], 201);
    }

    public function update(ModuleUpdateRequest $request)
    {
        $module = $this->moduleService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $module
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $this->moduleService->delete($request->id);

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }

    public function changeStatus(StatusUpdateRequest $request)
    {
        $this->moduleService->changeStatus($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }

    public function send(SendRequest $request)
    {
        $this->moduleService->send($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }


}
