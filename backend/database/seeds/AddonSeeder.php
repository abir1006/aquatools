<?php

use App\Models\Addon;
use Illuminate\Database\Seeder;

class AddonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Addon::create(
            [
                'name' => 'Custom Report',
                'slug' => 'custom_report'
            ]
        );

        Addon::create(
            [
                'name' => 'Save Template',
                'slug' => 'save_template'
            ]
        );

        Addon::create(
            [
                'name' => 'Download Template',
                'slug' => 'download_template'
            ]
        );

        Addon::create(
            [
                'name' => 'Share Template',
                'slug' => 'share_template'
            ]
        );

        Addon::create(
            [
                'name' => 'Save deadens, CoD',
                'slug' => 'save_cod'
            ]
        );
    }
}
