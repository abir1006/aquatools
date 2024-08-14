<?php
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder {

    public function run()
    {
        Company::create(
            [
                'name' => 'Spillfree',
                'contact_person' => 'Abdoon Nur',
                'contact_number' => '+4489562358',
                'email' => 'nur@teknordic.com',
                'type' => 'Yearly', 
                'currency' => 'NOK', 
                'number_of_licence' => 1,
                'status' => 1,
            ]
        );
    }
}
