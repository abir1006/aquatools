<?php

namespace App\Services;

use App\Models\Tag;

class TagsService
{

    public function list()
    {
        return Tag::all();
    }

    public function create($data)
    {
        return Tag::create($data);
    }

    public function update($id, $data)
    {
        $category  = Tag::find($id);
        $category->update($data);
        return $category;
    }
}
