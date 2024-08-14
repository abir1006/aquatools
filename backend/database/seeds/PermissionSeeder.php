<?php

use App\Models\Permission_Role;
use Illuminate\Database\Seeder;
use Kodeine\Acl\Models\Eloquent\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      /*
        $p = Permission::create(
            [
                'name' => "companies",
                'description' => "Super Admin Permission - Companies",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );

        $p = Permission::create(
            [
                'name' => "invoices",
                'description' => "Super Admin Permission - invoices",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );

        $p = Permission::create(
            [
                'name' => "users",
                'description' => "Super Admin Permission - Users",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );

        $p = Permission::create(
            [
                'name' => "reports",
                'description' => "Super Admin Permission - reports",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );

        $p = Permission::create(
            [
                'name' => "at_materials",
                'description' => "Super Admin Permission - at_materials",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );

        $p = Permission::create(
            [
                'name' => "models",
                'description' => "Super Admin Permission - models",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );


        $p = Permission::create(
            [
                'name' => "templates",
                'description' => "Super Admin Permission - templates",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );

        $p = Permission::create(
            [
                'name' => "settings",
                'description' => "Super Admin Permission - settings",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );



        $p = Permission::create(
            [
                'name' => "roles",
                'description' => "Super Admin Permission - Roles",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );

        $p = Permission::create(
            [
                'name' => "permissions",
                'description' => "Super Admin Permission - Permissions",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true,
                           'features' => true,
                           'actions' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );



        $p = Permission::create(
            [
                'name' => "invoice_settings",
                'description' => "Super Admin Permission - Invoice Settings",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true,
                           'currency_dropdown' => true,
                           'subscription_duration_dropdown' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );


        $p = Permission::create(
            [
                'name' => "help",
                'description' => "Super Admin Permission - help",
                'slug' => [
                           'list' => true,
                           'save'  => true,
                           'update' => true,
                           'delete' => true,
                           'search' => true
                        ]
            ]
        );
        Permission_Role::create(
            [
                'permission_id' => $p->id,
                'role_id' => 1
            ]
        );
        */

    }
}
