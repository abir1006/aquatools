<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use App\Http\Requests\MaterialStoreRequest;
use App\Http\Requests\MaterialUpdateRequest;
use App\Http\Requests\CustomFieldRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\PaginationRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\MaterialService;
use Config;

class MaterialController extends Controller
{

    protected $materialService;


    /**
     * @param MaterialService $materialService
     */
    public function __construct(MaterialService $materialService)
    {
        $this->materialService = $materialService;
    }

    public function saveOrder(Request $request)
    {
        return response()->json($this->materialService->saveOrder($request->all()), 200);
    }

    public function markAsRead(Request $request, $id)
    {
        return response()->json($this->materialService->markAsRead($id), 200);
    }
    public function getUnreadNofication()
    {
        return response()->json($this->materialService->unreadMaterialNotifications(), 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function singleMaterial($id)
    {
        $material = $this->materialService->getSingle($id);
        return response()->json($material, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function list()
    {
        $materials = request('all') ? $this->materialService->list(2000) : $this->materialService->list();

        return response()->json($materials, 200);
    }

    public function categories()
    {
        $items = $this->materialService->categories();

        return response()->json($items, 200);
    }

    public function listAll()
    {
        return response()->json($this->materialService->listAll(), 200);
    }

    public function search(Request $request)
    {
        $company = $this->materialService->search($request->all());

        return response()->json($company, 200);
    }


    public function listDetails(Request $request)
    {
        $company = $this->materialService->listDetails($request->all());

        return response()->json($company, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(MaterialStoreRequest $request)
    {

        $requestData = $request->all();
        $requestData['price'] = $requestData['price'] ? json_decode($requestData['price'], 1) : [];

        if ($request->has('resources')) {
            $requestData['fileData'] = $this->materialService->fileUpload($request->resources);
        }



        $material = $this->materialService->save($requestData);
        return response()->json(
            [
                'message' => config('settings.message.saved'),
                'data' => $material
            ],
            200
        );
    }


    /**
     * @param MaterialUpdateRequest $request
     * @return JsonResponse
     */

    public function update(MaterialUpdateRequest $request)
    {
        $requestData = $request->all();

        $requestData['price'] = $requestData['price'] ? json_decode($requestData['price'], 1) : [];

        if ($request->has('resources')) {
            $requestData['fileData'] = $this->materialService->fileUpload($request->resources);
        }

        $material = $this->materialService->update($requestData);
        return response()->json(
            [
                'message' => config('settings.message.updated'),
                'data' => $material
            ],
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeleteRequest $request)
    {


        $this->materialService->delete($request->all());

        return response()->json(
            [
                'message' => config('settings.message.deleted'),
            ],
            200
        );
    }

    public function deleteMaterialResources(DeleteRequest $request)
    {

        $this->materialService->deleteMaterialResources($request->all());

        return response()->json(
            [
                'message' => config('settings.message.deleted'),
            ],
            200
        );
    }
}
