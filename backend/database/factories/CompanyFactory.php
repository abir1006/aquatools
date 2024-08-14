<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */


use App\Models\Company;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Company::class, function (Faker $faker) {
    return [
        'name' => 'Spillfree',
        'contact_person' => 'Abdoon Nur',
        'contact_number' => '+4489562358',
        'email' => 'nur@teknordic.com',
        'status' => 1,
    ];
});
