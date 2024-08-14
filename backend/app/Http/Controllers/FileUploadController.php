<?php

namespace App\Http\Controllers;

use App\Services\FileService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Log;

class FileUploadController extends Controller
{

    private FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function companyLogo(Request $request)
    {
        $file_name = $this->fileService->upload($request->file('logo'), 'uploads/company_logo/');
        return response()->json(
            [
                'message' => 'Company logo uploaded successfully',
                'data' => [
                    'logo' => $file_name,
                    'logo_url' => Storage::url('uploads/company_logo/' . $file_name)
                ]
            ],
            200
        );
    }


    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function priceExcel(Request $request): JsonResponse
    {
        try {
            $file = $request->file('File');
            $name = $file->getClientOriginalName();
            $destinationPath = 'uploads/salmonprice/';

            if (!Storage::exists($destinationPath)) {
                Storage::makeDirectory($destinationPath);
            }

            $name = $this->fileService->upload($file, $destinationPath, $name);
            return response()->json(
                [
                    'message' => 'Price excel uploaded successfully',
                    'data' => ['Excel' => $name]
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(['message' => 'Upload failed'], 401);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function getPriceExcels(Request $request): JsonResponse
    {
        $files = Storage::files('uploads/salmonprice/');
        $excel_info = [];
        if ($files) {
            foreach ($files as $key => $file) {
                $excel_info[] = array(
                    'file_name' => basename($file),
                    'updated_at' =>  date('d/m/Y', Storage::lastModified($file) )
                );
            }
        }

        return response()->json(
            [
                'message' => 'Price excels',
                'data' => $excel_info
            ],
            200
        );
    }

}
