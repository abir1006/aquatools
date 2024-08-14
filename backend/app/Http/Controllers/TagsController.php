<?php

namespace App\Http\Controllers;

use App\Http\Requests\TagValidator;
use App\Models\Tag;
use App\Services\TagsService;
use Illuminate\Http\Request;


class TagsController extends Controller
{

    public $tagService = null;

    public function __construct(TagsService $tag)
    {
        $this->tagService = $tag;
    }

    public function index()
    {
        return response()->json($this->tagService->list(), 200);
    }


    public function store(TagValidator $request)
    {
        $tag = $this->tagService->create($request->all());

        return response()->json(
            [
                'message' => config('settings.message.saved'),
                'data' => $tag
            ],
            200
        );
    }


    public function update(TagValidator $request, Tag $tag)
    {

        $tag->update($request->all());
        return response()->json(
            [
                'message' => config('settings.message.updated'),
                'data' => $tag
            ],
            200
        );
    }


    public function destroy(Request $request, Tag $tag)
    {


        $deleted = $tag->delete();

        return response()->json(
            [
                'message' => config('settings.message.deleted'),
            ],
            200
        );
    }
}
