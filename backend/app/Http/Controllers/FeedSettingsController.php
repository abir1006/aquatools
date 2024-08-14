<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteRequest;
use App\Http\Requests\FeedSettingStoreRequest;
use App\Http\Requests\FeedSettingUpdateRequest;
use App\Services\FeedSettingService;
use Illuminate\Http\Request;
use Config;
use Illuminate\Http\Response;

class FeedSettingsController extends Controller
{

    private $feedSettingService;

    public function __construct(FeedSettingService $feedSettingService)
    {
        $this->feedSettingService = $feedSettingService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function list()
    {
        $feedSettings = $this->feedSettingService->list()->get();
        return response()->json($feedSettings, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function fieldsList(Request $request)
    {
        $fieldList = $this->feedSettingService->fieldsList($request->all());
        return response()->json($fieldList[0], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(FeedSettingStoreRequest $request)
    {
        $feedSettings = $this->feedSettingService->save($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $feedSettings
            ],
            201
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param FeedSettingUpdateRequest $request
     * @return Response
     */
    public function update(FeedSettingUpdateRequest $request)
    {
        $feedSettings = $this->feedSettingService->update($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $feedSettings
            ],
            201
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param DeleteRequest $request
     * @return Response
     */
    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->feedSettingService->delete($request->id);

        if ($deleted == 0) {
            return response()->json(
                [
                    'message' => Config::get('settings.message.not_found')
                ],
                404
            );
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted')
            ],
            200
        );
    }
}
