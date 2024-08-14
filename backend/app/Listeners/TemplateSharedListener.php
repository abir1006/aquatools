<?php

namespace App\Listeners;

use App\Events\TemplateShared;
use App\Models\Template;
use App\Models\UserActivity;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class TemplateSharedListener implements ShouldQueue
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
     * @param  object  $event
     * @return void
     */
    public function handle(TemplateShared $event)
    {
        //
    }
}
