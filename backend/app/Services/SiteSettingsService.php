<?php

namespace App\Services;

use App\Models\SiteSetting;

class SiteSettingsService
{


    public function list()
    {
        return SiteSetting::pluck('value', 'key')->toArray();
    }

    public function saveTransation($data)
    {
        collect($data)->each(function ($value, $key) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        });
    }
}
