<?php
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder {

    public function run()
    {
        User::create(
            [
                'first_name' => 'Abdoon',
                'last_name' => 'Nur',
                'email' => 'nur@teknordic.com',
                'password' => bcrypt('Aqua321!'),
                'company_id' => 1,
                'status' => 1,
                'remember_token' => Str::random(10),
            ]
        );



    }
}
