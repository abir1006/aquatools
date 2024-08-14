<?php

namespace App\Services;

use App\Models\CompanyTool;
use Config;

class CompanyToolService
{

    public function __construct()
    {

    }

    public function list()
    {
        return CompanyTool::orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(Config::get('settings.pagination.per_page'));
    }

    public function save($data)
    {
        return CompanyTool::create($data);
    }

    public function update($data)
    {
        $id = $data['id'];
        CompanyTool::findOrFail($id)->update($data);
        return CompanyTool::find($id);
    }

    public function delete($id)
    {
        return CompanyTool::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $company = CompanyTool::findOrFail($id);
        $company->status = $status;
        $company->save();

        return $company;
    }


}
