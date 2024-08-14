<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\TemplateShare;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('sso.logout', function () {
    return true;
});


Broadcast::channel(
    'notification.{user_id}',
    function ($user, $user_id) {
        return (int)$user->id === (int)$user_id;
    }
);


Broadcast::channel(
    'modelPermission.{company_id}',
    function ($user, $company_id) {
        return (int)$user->company_id === (int)$company_id;
    }
);
