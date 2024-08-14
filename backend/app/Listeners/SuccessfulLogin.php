<?php

namespace App\Listeners;

use App\Models\UserActivity;
use DB;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SuccessfulLogin
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Login  $event
     * @return void
     */
    public function handle(Login $event)
    {
        // update logged in time
        $user = $event->user;
        DB::table('users')
            ->where('id', $user->id)
            ->update(['last_login_at' => date('Y-m-d H:i:s')]);

        // log activity
        // UserActivity::create(['user_id' => $user->id, 'type' => 'logged in']);
    }
}
