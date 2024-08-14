<?php

namespace App\Services;

use App\Models\Tool;
use Config;

class ToolService
{

    public function __construct()
    {
    }

    public function getSingleBySlug($slug)
    {
        return Tool::where('slug', $slug)->first();
    }
    public function list()
    {
        //return Tool::all();
        return Tool::orderBy('created_at', Config::get('settings.pagination.order_by'))
            ->orderBy('id', 'asc')
            ->get();
    }

    public function save($data)
    {
        $tool = Tool::create($data);
        return Tool::find($tool->id);
    }

    public function update($data)
    {
        $id = $data['id'];
        Tool::findOrFail($id)->update($data);
        return Tool::find($id);
    }

    public function delete($id)
    {
        Tool::findOrFail($id);
        return Tool::destroy($id);
    }

    public function find($id)
    {
        return Tool::find($id);
    }
}
