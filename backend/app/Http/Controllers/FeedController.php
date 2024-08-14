<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\FeedStoreRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\FeedUpdateRequest;
use App\Services\CustomFieldService;
use App\Services\FeedService;

use Config;
use Illuminate\Http\JsonResponse;


class FeedController extends Controller
{
    private $feedService;
    private $customFieldService;

    /**
     * UserController constructor.
     * @param FeedService $feedService
     * @param CustomFieldService $customFieldService
     */
    public function __construct(FeedService $feedService, CustomFieldService $customFieldService)
    {
        $this->feedService = $feedService;
        $this->customFieldService = $customFieldService;
    }

    /**
     * @return JsonResponse
     */
    public function list()
    {
        $feedLibrary = $this->feedService->list();
        return response()->json($feedLibrary, 200);
    }


    /**
     * @param FeedStoreRequest $request
     * @return JsonResponse
     */
    public function store(FeedStoreRequest $request)
    {
        // Insert feed library data
        $feedLibrary = $this->feedService->save($request->all());

        // Insert company custom field data
        $data = $request->all();
        if (count($data['companyCustomFields']['fields']) > 0) {
            $fields_data = $data['companyCustomFields'];
            $this->customFieldService->save($fields_data);
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $feedLibrary
            ],
            201
        );
    }

    /**
     * @param DeleteRequest $request
     * @return JsonResponse
     */
    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->feedService->delete($request->id);

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
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    /**
     * @param FeedUpdateRequest $request
     * @return JsonResponse
     */
    public function update(FeedUpdateRequest $request)
    {
        $feed = $this->feedService->update($request->all());

        // Insert additional company custom field data
        $data = $request->all();
        if (count($data['companyCustomFields']['fields']) > 0) {
            $fields_data = $data['companyCustomFields'];
            $this->customFieldService->save($fields_data);
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $feed
            ],
            200
        );
    }
}
