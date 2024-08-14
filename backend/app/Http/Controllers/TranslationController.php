<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryValidator;
use App\Http\Requests\TranslationValidator;
use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Spatie\TranslationLoader\LanguageLine;

class TranslationController extends Controller
{

    public $translationService = null;

    public function __construct(TranslationService $category)
    {
        $this->translationService = $category;
    }

    public function index(Request $request)
    {
        return $this->sendResponse($this->translationService->list($request->all()), null);
    }

    public function import(Request $request)
    {
        $count = $this->translationService->import($request->all());
        $message = request('update_existing_key', false) ? $count . ' items imported (inserted and updated )' : $count . ' items inserted';
        return $this->sendResponse(null, $message);
    }

    public function export()
    {
        $headers = array(
            "Content-type" => "application/octet-stream",
            "Content-Disposition" => "attachment; filename=file.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        $callback = $this->translationService->export();

        return response()->stream($callback, 200, $headers);
    }

    public function languages(Request $request)
    {
        return $this->sendResponse($this->translationService->availableLanguage(), null);
    }

    public function fetch(Request $request, $lang)
    {

        return $this->translationService->fetch($lang);
    }

    public function store(TranslationValidator $request)
    {
        $item = $this->translationService->create($request->all());

        return $this->sendResponse($item, config('settings.message.saved'), 201);
    }


    public function update(TranslationValidator $request, LanguageLine $translation)
    {

        $translation->update($request->all());
        return $this->sendResponse($translation, config('settings.message.updated'));
    }


    public function destroy(Request $request, LanguageLine $translation)
    {
        $deleted = $translation->delete();
        return $this->sendResponse(null, config('settings.message.deleted'), 204);
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
