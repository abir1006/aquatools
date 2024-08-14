<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddonStoreRequest;
use App\Http\Requests\AddonUpdateRequest;
use App\Http\Requests\DeleteRequest;
use App\Services\AddonService;
use Illuminate\Http\Request;
use Config;

class AddonController extends Controller
{
    protected $addonService;


    public function __construct(AddonService $addonService)
    {
        $this->addonService = $addonService;
    }

    public function list(Request $request)
    {
        $addons = $this->addonService->list($request->all());

        return response()->json($addons, 200);
    }

    public function store(AddonStoreRequest $request)
    {
        $addon = $this->addonService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $addon
        ], 201);
    }

    public function update(AddonUpdateRequest $request)
    {
        $addon = $this->addonService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $addon
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->addonService->delete($request->id);

        if($deleted == 0) {
            return response()->json([
                'message' => Config::get('settings.message.not_found')
            ], 404);
        }

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }


}
