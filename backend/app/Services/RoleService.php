<?php

namespace App\Services;

use Illuminate\Support\Str;
use Kodeine\Acl\Models\Eloquent\Role;
use Config;

class RoleService
{

    public function __construct()
    {

    }

    public function list()
    {
        return Role::orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(Config::get('settings.pagination.per_page'));
    }

    public function listAll($data)
    {
        return Role::get(['id','name']);
    }

    public function save($data)
    {
        //$data['slug'] = Str::slug($data['name'], '_');
        return Role::create($data);
    }

    public function update($data)
    {
        $id = $data['id'];
        Role::findOrFail($id)->update($data);
        return Role::find($id);
    }

    public function delete($id)
    {
        return Role::destroy($id);
    }


}
