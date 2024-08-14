<?php


namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Config;

class NotificationService
{
    private $notificationService;

    public function __construct()
    {
    }

    public function list()
    {
        //$user = User::find(7);
        //return $user->notifications;
        return Auth::user()->notifications;
    }

    public function delete($id)
    {
        return Auth::user()->notifications()
            ->where('id', $id)
            ->get()
            ->first()
            ->delete();
    }

}
