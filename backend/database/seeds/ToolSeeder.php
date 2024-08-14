<?php

use App\Models\Tool;
use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Tool::create(
            [
                'name' => 'Genetics',
                'slug' => 'genetics'
            ]
        );

        Tool::create(
            [
                'name' => 'Optimalisering',
                'slug' => 'optimalisering'
            ]
        );

        Tool::create(
            [
                'name' => 'Cost of Disease',
                'slug' => 'cost_of_disease'
            ]
        );

        Tool::create(
            [
                'name' => 'MTB',
                'slug' => 'mtb'
            ]
        );

        Tool::create(
            [
                'name' => 'KN For',
                'slug' => 'kn_for'
            ]
        );

        Tool::create(
            [
                'name' => 'Vaksinering',
                'slug' => 'vaksinering'
            ]
        );

        Tool::create(
            [
                'name' => 'Slaktmodel',
                'slug' => 'slaktmodel'
            ]
        );

    }
}
