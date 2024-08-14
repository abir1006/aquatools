<?php

namespace App\Services;

use App\Models\CompanyAddon;
use Config;

class CompanyAddonService
{

    public function __construct()
    {

    }

    public function list()
    {
        return CompanyAddon::orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(Config::get('settings.pagination.per_page'));
    }

    public function save($data)
    {
        return CompanyAddon::create($data);
    }

    public function update($data)
    {
        $id = $data['id'];
        CompanyAddon::findOrFail($id)->update($data);
        return CompanyAddon::find($id);
    }

    public function delete($id)
    {
        return CompanyAddon::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $company = CompanyAddon::findOrFail($id);
        $company->status = $status;
        $company->save();

        return $company;
    }


}
