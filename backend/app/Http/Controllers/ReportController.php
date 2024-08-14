<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Services\ReportService;
use App\Services\UserService;
use Illuminate\Http\Request;
use App\Http\Requests\DeleteRequest;
use Config;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    /**
     * @var UserService
     */

    private $reportService;


    /**
     * UserController constructor.
     * @param ReportService $reportService
     */
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function list()
    {
        $reports = $this->reportService->list();
        $reports = $reports->orderBy('created_at', Config::get('settings.pagination.order_by'))
            ->paginate(Config::get('settings.pagination.per_page'));

        return response()->json($reports, 200);
    }

    public function search(Request $request)
    {
        $reports = $this->reportService->search($request->all());
        $reports = $reports->orderBy('created_at', Config::get('settings.pagination.order_by'))
            ->paginate(Config::get('settings.pagination.per_page'));

        return response()->json($reports, 200);
    }

    public function listSort(Request $request)
    {
    }


    /**
     * @param DeleteRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->reportService->delete($request->id);

        if ($deleted == 0) {
            return response()->json(
                [
                    'message' => Config::get('settings.message.not_found')
                ],
                404
            );
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    public function download(Request $request)
    {
        $fileUrl = $request->get('url');
        if (!Storage::exists($fileUrl)) {
            return response()->json(
                [
                    'message' => 'File does not exist'
                ],
                404
            );
        }
        return Storage::download($fileUrl);
    }
}
