<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ToolStoreRequest;
use App\Http\Requests\ToolUpdateRequest;
use App\Http\Requests\DeleteRequest;
use App\Services\ToolService;
use Illuminate\Http\Request;
use Config;
use Illuminate\Support\Facades\File;

class ToolController extends Controller
{
    protected $toolService;


    public function __construct(ToolService $toolService)
    {
        $this->toolService = $toolService;
    }

    public function getSingle(Request $request, $slug)
    {
        return response()->json($this->toolService->getSingleBySlug($slug), 200);
    }

    public function upload(Request $request)
    {

        $file = request()->file('file');
        $path = public_path() . '/uploads/models';

        if (!File::isDirectory($path)) {

            File::makeDirectory($path, 0777, true, true);
        }

        $name = uniqid() . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->move($path, $name);
        return response()->json(['location' => "/uploads/models/$name"]);
    }
    public function list(Request $request)
    {
        $tools = $this->toolService->list($request->all());

        return response()->json($tools, 200);
    }

    public function store(ToolStoreRequest $request)
    {
        $tool = $this->toolService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $tool
        ], 201);
    }

    public function update(ToolUpdateRequest $request)
    {
        $tool = $this->toolService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $tool
        ], 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $this->toolService->delete($request->id);

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }
}
