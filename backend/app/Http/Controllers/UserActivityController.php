<?php

namespace App\Http\Controllers;

use App\Exports\UserActivityLogsExport;
use App\Http\Controllers\Controller;

use App\Http\Requests\DeleteRequest;
use App\Models\UserActivity;
use App\Services\UserActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Config;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class UserActivityController extends Controller
{
    private $userActivityService;

    /**
     * UserActivityController constructor.
     * @param UserActivityService $userActivityService
     */
    public function __construct(UserActivityService $userActivityService)
    {
        $this->userActivityService = $userActivityService;
    }

    /**
     * @return JsonResponse
     */
    public function latest()
    {
        // Latest 5 user activity
        $data = $this->userActivityService->list()
            ->orderBy('created_at', Config::get('settings.pagination.order_by'))
            ->take(5)
            ->get();
        return response()->json($data, 200);
    }

    public function logs(Request $request)
    {
        $filter_data = false;
        if ($request->filter_data) {
            $filter_data = $request->filter_data;
        }
        $data = $this->userActivityService->logs($filter_data);
        return response()->json($data, 200);
    }

    public function destroy(DeleteRequest $request)
    {
        $deleted = $this->userActivityService->delete($request->id);

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

    public function deleteLogs(Request $request)
    {
        $this->userActivityService->deleteLogs($request->all());
        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    public function export(Request $request)
    {
        $filter_data = false;
        if ($request->filter_data) {
            $filter_data = $request->filter_data;
        }

        return Excel::download(new UserActivityLogsExport($filter_data), 'logs.xlsx');
        //return response()->json($data, 200);
    }
}
