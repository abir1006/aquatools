<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryValidator;
use App\Models\MaterialCategory;
use App\Services\MaterialCategoryService;
use Illuminate\Http\Request;
use Config;

class MaterialCategoryController extends Controller
{

    public $categorySevice = null;

    public function __construct(MaterialCategoryService $category)
    {
        $this->categorySevice = $category;
    }

    public function index()
    {
        return response()->json($this->categorySevice->list(), 200);
    }


    public function store(CategoryValidator $request)
    {
        $category = $this->categorySevice->create($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $category
            ],
            200
        );
    }


    public function update(CategoryValidator $request, MaterialCategory $category)
    {

        $category->update($request->all());
        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $category
            ],
            200
        );
    }


    public function destroy(Request $request, MaterialCategory $category)
    {


        $deleted = $category->delete();

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }
}
