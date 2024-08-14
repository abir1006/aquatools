<?php

namespace App\Providers;

use App\Events\CompanyCreated;
use App\Events\CompanyModelUpdated;
use App\Events\TemplateCreated;
use App\Events\TemplateShared;
use App\Events\TemplateUpdated;
use App\Listeners\CompanyCreatedListener;
use App\Listeners\CompanyModelUpdatedListener;
use App\Listeners\TemplateCreatedListener;
use App\Listeners\TemplateSharedListener;
use App\Listeners\TemplateUpdatedListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'Illuminate\Auth\Events\Login' => [
            'App\Listeners\SuccessfulLogin',
        ],
        CompanyCreated::class => [
            CompanyCreatedListener::class
        ],
        TemplateShared::class => [
            TemplateSharedListener::class
        ],
        TemplateCreated::class => [
            TemplateCreatedListener::class
        ],
        TemplateUpdated::class => [
            TemplateUpdatedListener::class
        ],
        CompanyModelUpdated::class => [
            CompanyModelUpdatedListener::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
