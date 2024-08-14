<?php

namespace App\Mail;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ModelTrialEnd extends Mailable
{
    use Queueable, SerializesModels;

    public $company;
    public $invoice_details;

    /**
     * Create a new message instance.
     *
     * @param Company $company
     * @param $invoice_details
     */
    public function __construct(Company $company, $invoice_details)
    {
        $this->company = $company;
        $this->invoice_details = $invoice_details;
    }

    /**
     * Build the message.
     *
     * @param Request $request
     * @return $this
     */
    public function build(Request $request)
    {
        $invoice_details = $this->invoice_details;
        return $this->subject('AquaTools v2.0 - '. $this->invoice_details['item_name'].' model trial period will end soon')
            ->view('email.company.modelTrialEnd')
            ->with($invoice_details);
    }
}
