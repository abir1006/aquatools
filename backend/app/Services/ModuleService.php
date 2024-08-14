<?php

namespace App\Services;

use App\Models\Module;
use Config;

class ModuleService
{

    public function __construct()
    {

    }

    public function list($data)
    {
        $tool_id = $data['tool_id'];
        return Module::where('tool_id',$tool_id)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'tool_id', 'name', 'slug', 'status']);

        // return Module::orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(Config::get('settings.pagination.per_page'));
    }

    public function save($data)
    {
        $module = Module::create($data);
        return Module::find($module->id);
    }

    public function update($data)
    {
        $id = $data['id'];
        Module::findOrFail($id)->update($data);
        return Module::find($id);
    }

    public function delete($id)
    {
        Module::findOrFail($id);
        return Module::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $company = Module::findOrFail($id);
        $company->status = $status;
        $company->save();

        return $company;
    }


}
