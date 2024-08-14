<?php

namespace App\Services;

use App\Models\FeedSetting;
use Illuminate\Support\Str;
use Config;

class FeedSettingService
{

    public function __construct()
    {
    }

    public function list()
    {
        return FeedSetting::orderBy('created_at', Config::get('settings.pagination.order_by'));
    }

    public function fieldsList($data)
    {
        $settingsName = $data['name'];
        return FeedSetting::where('name', $settingsName)->pluck('fields_data');
    }

    public function save($data)
    {
        return FeedSetting::create($data);
    }

    public function update($data)
    {
        $id = $data['id'];
        return FeedSetting::findOrFail($id)->update($data);
    }


    public function delete($id)
    {
        return FeedSetting::destroy($id);
    }
}
