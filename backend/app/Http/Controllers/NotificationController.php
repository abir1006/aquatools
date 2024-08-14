<?php

namespace App\Http\Controllers;

use Config;
use App\Http\Requests\NotificationDeleteRequest;
use App\Services\NotificationService;


class NotificationController extends Controller
{
    //

    private $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function latest()
    {
        $notifications = $this->notificationService->list();
        return response()->json($notifications->take(5), 200);
    }

    public function destroy(NotificationDeleteRequest $request)
    {
        $deleted = $this->notificationService->delete($request->id);

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
}
