<?php

namespace App\Http\Controllers;

use App\Services\SiteSettingsService;
use Illuminate\Http\Request;

class SiteSettingsController extends Controller
{

    public $settingsService = null;

    public function __construct(SiteSettingsService $settings)
    {
        $this->settingsService = $settings;
        app()->setlocale(request()->header('lang'));
    }

    public function index(Request $request)
    {
        return $this->sendResponse($this->settingsService->list(), null);
    }

    public function saveTranslationSettings(Request $request)
    {
        $this->settingsService->saveTransation($request->all());

        return $this->sendResponse('', __('site_settings_message_success'), 201);
    }

    public function sendResponse($data, $message, $code = 200)
    {
        $output = [];
        if ($message)
            $output['message'] = $message;

        if ($data)
            $output['data'] = $data;

        return response()->json($output, $code);
    }
}
