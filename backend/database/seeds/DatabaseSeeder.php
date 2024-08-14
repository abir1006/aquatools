<?php
use App\Models\Company;
use App\Models\Permission_Role;
use App\Models\Role_User;
use App\Models\User;
use Kodeine\Acl\Models\Eloquent\Permission;
use Kodeine\Acl\Models\Eloquent\Role;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

       // Company::truncate();
       // User::truncate();
       // Role::truncate();
       // Role_User::truncate();
       // Permission::truncate();
       // Permission_Role::truncate();

       // $this->call(CompanySeeder::class);

       //  $this->call(UserSeeder::class);

       //  $this->call(RoleSeeder::class);

       // $this->call(PermissionSeeder::class);

       // $this->call(ToolSeeder::class);
       // $this->call(AddonSeeder::class);
       // $this->call(MaterialSeeder::class);

    }
}
