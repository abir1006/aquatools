<?php

use App\Models\Material;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Material::create(
            [
                'name' => 'Genetics Training',
                'slug' => 'genetics_training',
                'category' => 'video'
            ]
        );

        Material::create(
            [
                'name' => 'MTB Training',
                'slug' => 'mtb_training',
                'category' => 'video'
            ]
        );

        Material::create(
            [
                'name' => 'COD Documents',
                'slug' => 'cod_documents',
                'category' => 'PDF'
            ]
        );

    }
}
