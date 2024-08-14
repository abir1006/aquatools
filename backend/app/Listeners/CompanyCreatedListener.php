<?php

namespace App\Listeners;

use App\Events\CompanyCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class CompanyCreatedListener
{
    /**
     * Create the event listener.
     *
     */


    public function __construct()
    {
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(CompanyCreated $event)
    {

        $email = $event->company->email;
        Mail::to($email)->send(new \App\Mail\CompanyCreated($event->company));

    }
}
