<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlockStoreRequest;
use App\Http\Requests\BlockUpdateRequest;
use App\Http\Requests\BlockListRequest;
use App\Http\Requests\InputDeleteRequest;
use App\Http\Requests\SendRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Services\BlockService;
use Illuminate\Http\Request;
use Config;

class BlockController extends Controller
{
    protected $blockService;


    public function __construct(BlockService $blockService)
    {
        $this->blockService = $blockService;
    }

    public function list(BlockListRequest $request)
    {
        $blocks = $this->blockService->list($request->all());

        return response()->json($blocks, 200);
    }

    public function store(BlockStoreRequest $request)
    {
        $block = $this->blockService->save($request->all());

        return response()->json([
            'message' => Config::get('settings.message.saved'),
            'data' => $block
        ], 201);
    }

    public function update(BlockUpdateRequest $request)
    {
        $block = $this->blockService->update($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated'),
            'data' => $block
        ], 200);
    }

    public function destroy(InputDeleteRequest $request)
    {
        $this->blockService->delete($request->id);

        return response()->json([
            'message' => Config::get('settings.message.deleted'),
        ], 200);
    }

    public function changeStatus(StatusUpdateRequest $request)
    {
        $this->blockService->changeStatus($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }

    public function send(SendRequest $request)
    {
        $this->blockService->send($request->all());

        return response()->json([
            'message' => Config::get('settings.message.updated')
        ], 200);
    }


}
