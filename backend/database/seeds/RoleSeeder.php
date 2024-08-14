<?php

use App\Models\Role_User;
use Illuminate\Database\Seeder;
use Kodeine\Acl\Models\Eloquent\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::create(
            [
                'name' => "Super Admin",
                'slug' => "super_admin"
            ]
        );

        Role_User::create(
            [
                'user_id' => 1,
                'role_id' => 1
            ]
        );
    }
}
