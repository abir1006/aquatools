<?php

namespace App\Mail;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountRemoved extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Create a new message instance.
     *
     * @param Company $company
     * @param Request $request
     */
    public function __construct()
    {
    }

    /**
     * Build the message.
     *
     * @param Request $request
     * @return $this
     */
    public function build(Request $request)
    {
        return $this->subject('AquaTools v2.0 - your account has been removed')
            ->view('email.user.delete');
    }
}
