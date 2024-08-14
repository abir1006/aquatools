<?php

namespace App\Services;

use Illuminate\Support\Facades\Artisan;
use App\Models\Permission_Role;
use App\Models\ACLPermission;
use Illuminate\Support\Str;
use Kodeine\Acl\Models\Eloquent\Permission;
use Kodeine\Acl\Models\Eloquent\Role;
use Config;
use DB;

class PermissionService
{

    public function __construct()
    {
    }

    public function list()
    {
        return Permission::with('roles')->orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(Config::get('settings.pagination.per_page'));
    }

    public function save($data)
    {
        $data['name'] = Str::slug($data['name'], '_');

        //.........duplicate check start .............
        $role = Role::findOrFail($data['role_id']);
        $permissions = $role->getPermissions();

        $check = 0;
        foreach ($permissions as $key => $value) {
            if ($key == $data['name']) {
                $check = 1;
                break;
            }
        }

        if ($check == 1) {
            return Permission::where('name', $data['name'])->first();
        }
        //.........duplicate check end .............

        Artisan::call('cache:clear');
        $permission = Permission::create($data);
        return $role->assignPermission($permission);
    }

    public function update($data)
    {
        Artisan::call('cache:clear');

        // $id = $data['id'];
        // $data['name'] = Str::slug($data['name'], '_');
        // Permission::findOrFail($id)->update($data);

        $id = $data['id'];
        $data['name'] = Str::slug($data['name'], '_');
        ACLPermission::findOrFail($id)->update($data);

        return Permission::find($id);
    }

    public function delete($id)
    {
        Artisan::call('cache:clear');

        Permission_Role::where('permission_id', $id)->delete();
        return Permission::destroy($id);
    }


    public function features($data)
    {
        $result = [];
        $role_slug = Config::get('settings.permission.super_admin_slug');
        $sa_permissions = Permission_Role::with('permission', "role")
            ->whereHas('role', function ($query) use ($role_slug) {
                $query->where("slug", $role_slug);
            })->get();

        foreach ($sa_permissions as $key => $value) {
            array_push($result, $value->permission->name);
        }

        return $result;
    }

    public function actions($data)
    {
        $role_id = $data['role_id'];
        $name = $data['name'];
        $permission_id = NULL;


        $role_slug = Config::get('settings.permission.super_admin_slug');
        $sa_permissions = Permission_Role::with("permission", "role")
            ->whereHas('permission', function ($query) use ($name) {
                $query->where("name", $name);
            })
            ->whereHas('role', function ($query) use ($role_slug) {
                $query->where("slug", $role_slug);
            })->first();

        $sa_permissions = $sa_permissions->permission->slug;


        $r_permissions = Permission_Role::with("permission")
            ->whereHas('permission', function ($query) use ($name) {
                $query->where("name", $name);
            })
            ->where('role_id', $role_id)
            ->first();


        if (!empty($r_permissions)) {

            $permission_id = $r_permissions->permission->id;
            $r_permissions = $r_permissions->permission->slug;

            $actions = [];
            foreach ($sa_permissions as $sa_key => $value) {
                $i = 0;
                foreach ($r_permissions as $r_key => $row) {
                    if ($sa_key == $r_key) {
                        $actions[$sa_key] = $row;
                        $i++;
                    }
                }
                if ($i == 0) {
                    $actions[$sa_key] = false;
                }
            }
        } else {

            foreach ($sa_permissions as $sa_key => $value) {
                $actions[$sa_key] = false;
            }
        }

        $result['permission_id'] = $permission_id;
        $result['actions'] = $actions;
        return $result;
    }

    public function roleWiseUpdate($data)
    {
        $role_id = $data['role_id'];
        $name = $data['name'];

        $role_permission = Permission_Role::where('role_id', $role_id)
            ->whereHas('permission', function ($query) use ($name) {
                $query->where("name", $name);
            })->first();

        if (empty($role_permission)) {
            return null;
        }

        ACLPermission::findOrFail($role_permission['permission_id'])->update($data);

        return Permission::find($role_permission['permission_id']);
    }
}
