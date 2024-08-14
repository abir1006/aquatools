<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleStoreRequest;
use App\Http\Requests\RoleUpdateRequest;
use App\Http\Requests\DeleteRequest;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Config;

class RoleController extends Controller
{
    protected $roleService;


    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function list(Request $request)
    {
        $roles = $this->roleService->list($request->all());

        return response()->json($roles, 200);
    }

    public function listAll(Request $request)
    {
        $roles = $this->roleService->listAll($request->all());

        return response()->json($roles, 200);
    }

    public function store(RoleStoreRequest $request)
    {
        $role = $this->roleService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $role
        ], 201);
    }

    public function update(RoleUpdateRequest $request)
    {
        $role = $this->roleService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $role
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->roleService->delete($request->id);

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
