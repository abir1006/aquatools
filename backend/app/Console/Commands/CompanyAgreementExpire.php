<?php

namespace App\Console\Commands;

use App\Events\CompanyModelUpdated;
use App\Models\Company;
use App\Models\CompanyTool;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Tool;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class CompanyAgreementExpire extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'agreement:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $invoices = Invoice::with('invoiceDetails')->get()->toArray();

        foreach ($invoices as $invoice) {
            $company_id = $invoice['company_id'];
            $company = Company::with('lastInvoice')->find($company_id);

            $days_to_expire = (strtotime($invoice['agreement_end_date'].' 23:59:59') - strtotime(date('Y-m-d'))) / (60 * 60 * 24);
            $already_date_expired = strtotime(date('Y-m-d')) > strtotime($invoice['agreement_end_date']);

            // Send email before trial period ended
            if ($invoice['trial_period'] == 1 && $company['is_trial_used'] == 0 && $company['expire_email_sent'] == 0 && $invoice['agreement_period'] != 0 && $already_date_expired == false && $days_to_expire <= 1) {
                Company::where('id', $company_id)->update(['expire_email_sent' => 1]);
                Mail::to($company->email)->send(new \App\Mail\BeforeTrialEnd($company));
            }

            // Send email before 1 month agreement expired if already not sent and
            if ($invoice['trial_period'] == 0 && $company['expire_email_sent'] == 0 && $invoice['agreement_period'] != 0 && $already_date_expired == false && $days_to_expire <= 30) {
                Company::where('id', $company_id)->update(['expire_email_sent' => 1]);
                Mail::to($company->email)->send(new \App\Mail\BeforeAgreementEnd($company));
            }

            // check if company agreement expired with current date
            if ($invoice['agreement_period'] != 0 && strtotime(date('Y-m-d')) > strtotime(
                    $invoice['agreement_end_date']
                )) {
                CompanyModelUpdated::dispatch($company);

                // Reset trial used flag when company agreement end
                if ($company->is_trial_used == 1) {
                    Company::where('id', $company_id)->update(['is_trial_used' => 0]);
                }


                Invoice::where('id', $invoice['id'])
                    ->update(
                        ['agreement_period' => 0]
                    );

                InvoiceDetail::where('invoice_id', $invoice['id'])->update(
                    ['trial' => null]
                );

                // Set flag that company already used trial period
                if ($company->is_trial_used == 0 && $invoice['trial_period'] == 1) {
                    $company->is_trial_used = 1;
                    $company->save();
                }

                // send agreement end email to company
                Mail::to($company->email)->send(new \App\Mail\AgreementEnded($company));

                // block company after agreement end
                Company::where('id', $company_id)->update(['status' => 0]);
            }

            foreach ($invoice['invoice_details'] as $invDetails) {
                $model_trial_end_date = str_replace('/', '-', $invDetails['trial_end']). ' 23:59:59';
                $model_days_to_expire = (strtotime($model_trial_end_date) - strtotime(date('Y-m-d'))) / (60 * 60 * 24);
                if($invDetails['trial'] !== '' && $invDetails['expire_email_sent'] == 0 && $model_days_to_expire <= 3) {
                    InvoiceDetail::where('id', $invDetails['id'])->update(
                        ['expire_email_sent' => 1]
                    );
                    Mail::to($company->email)->send(new \App\Mail\ModelTrialEnd($company, $invDetails));
                }
                if ($invDetails['trial'] !== '' && $this->isExpired($invDetails['trial_end'])) {
                    CompanyModelUpdated::dispatch($company);
                    InvoiceDetail::where('id', $invDetails['id'])->update(
                        ['trial' => null]
                    );

                    // Find model id that trial period is ended
                    $ended_model_id = Tool::where('slug', $invDetails['item_slug'])->pluck('id');

                    // Remove model entry from company tools table if trial period ended.
                    CompanyTool::where('company_id', $company_id)
                        ->where('tool_id', $ended_model_id)
                        ->delete();
                }
            }
        }
    }

    private function isExpired($dateStr)
    {
        $formattedDate = str_replace('/', '-', $dateStr);
        return strtotime(date('Y-m-d')) > strtotime($formattedDate);
    }
}
