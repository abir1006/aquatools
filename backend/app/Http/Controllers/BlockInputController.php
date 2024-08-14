<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlockInputStoreRequest;
use App\Http\Requests\BlockInputUpdateOrderRequest;
use App\Http\Requests\BlockInputUpdateRequest;
use App\Http\Requests\BlockInputListRequest;
use App\Http\Requests\InputDeleteRequest;
use App\Http\Requests\SendRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Services\BlockInputService;
use Illuminate\Http\Request;
use Config;

class BlockInputController extends Controller
{
    protected $blockInputService;


    public function __construct(BlockInputService $blockInputService)
    {
        $this->blockInputService = $blockInputService;
    }

    public function list(BlockInputListRequest $request)
    {
        $blockInputs = $this->blockInputService->list($request->all());

        return response()->json($blockInputs, 200);
    }

    public function store(BlockInputStoreRequest $request)
    {
        $blockInput = $this->blockInputService->save($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $blockInput
            ],
            201
        );
    }

    public function update(BlockInputUpdateRequest $request)
    {
        $blockInput = $this->blockInputService->update($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $blockInput
            ],
            200
        );
    }

    public function dragAndDrop(BlockInputUpdateOrderRequest $request)
    {
        $blockInput = $this->blockInputService->updateOrder($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $blockInput
            ],
            200
        );
    }

    public function destroy(InputDeleteRequest $request)
    {
        $this->blockInputService->delete($request->id);

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    public function changeStatus(StatusUpdateRequest $request)
    {
        $this->blockInputService->changeStatus($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated')
            ],
            200
        );
    }

    public function send(SendRequest $request)
    {
        $this->blockInputService->send($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated')
            ],
            200
        );
    }


}
