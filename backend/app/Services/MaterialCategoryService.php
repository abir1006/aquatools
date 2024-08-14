<?php

namespace App\Services;

use App\Models\MaterialCategory;

class MaterialCategoryService
{

    public function list()
    {
        return MaterialCategory::all();
    }

    public function create($data)
    {
        return MaterialCategory::create($data);
    }

    public function update($id, $data)
    {
        $category  = MaterialCategory::find($id);
        $category->update($data);
        return $category;
    }
}
