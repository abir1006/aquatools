<?php

namespace App\Mail;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AgreementExtended extends Mailable
{
    use Queueable, SerializesModels;

    public $company;
    public $options;

    /**
     * Create a new message instance.
     *
     * @param Company $company
     * @param $options
     */
    public function __construct(Company $company, $options)
    {
        $this->company = $company;
        $this->options = $options;
    }

    /**
     * Build the message.
     *
     * @param Request $request
     * @return $this
     */
    public function build(Request $request)
    {
        return $this->subject('AquaTools v2.0 - your company agreement has been updated')
            ->view('email.company.agreementExtended');
    }
}
