<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionStoreRequest;
use App\Http\Requests\PermissionUpdateRequest;
use App\Http\Requests\PermissionActionRequest;
use App\Http\Requests\DeleteRequest;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Config;

class PermissionController extends Controller
{
    protected $permissionervice;


    public function __construct(PermissionService $permissionervice)
    {
        $this->permissionService = $permissionervice;
    }

    public function list(Request $request)
    {
        $permission = $this->permissionService->list($request->all());

        return response()->json($permission, 200);
    }

    public function store(PermissionStoreRequest $request)
    {
        $permission = $this->permissionService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $permission
        ], 201);
    }

    public function update(PermissionUpdateRequest $request)
    {
        $permission = $this->permissionService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $permission
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->permissionService->delete($request->id);

        if($deleted == 0) {
            return response()->json([
                'message' => Config::get('settings.message.not_found')
            ], 404);
        }

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }

    public function features(Request $request)
    {
        $features = $this->permissionService->features($request->all());

        return response()->json([
            'data' => $features
        ], 200);
    }

    public function actions(PermissionActionRequest $request)
    {
        $actions = $this->permissionService->actions($request->all());

        return response()->json([
            'data' => $actions
        ], 200);
    }

    public function roleWiseUpdate(PermissionStoreRequest $request)
    {
        $permission = $this->permissionService->roleWiseUpdate($request->all());
        
        if(empty($permission))
        {
            return response()->json([
                'message' => Config::get('settings.message.not_found')
            ], 404);
        }

        return response()->json([
            'data' => $permission
        ], 200);
    }


}
