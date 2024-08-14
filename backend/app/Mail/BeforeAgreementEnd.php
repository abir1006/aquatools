<?php

namespace App\Mail;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BeforeAgreementEnd extends Mailable
{
    use Queueable, SerializesModels;

    public $company;

    /**
     * Create a new message instance.
     *
     * @param Company $company
     * @param Request $request
     */
    public function __construct(Company $company)
    {
        $this->company = $company;
    }

    /**
     * Build the message.
     *
     * @param Request $request
     * @return $this
     */
    public function build(Request $request)
    {
        return $this->subject('AquaTools v2.0 - your company agreement will end soon')
            ->view('email.company.beforeAgreementEnd');
    }
}
