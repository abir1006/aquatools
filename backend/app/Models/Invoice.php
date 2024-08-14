<?php

namespace App\Models;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'company_id',
        'sending_date',
        'agreement_start_date',
        'agreement_end_date',
        'number_of_user',
        'status',
        'agreement_period',
        'is_sent',
        'trial_period'
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function invoiceDetails()
    {
        return $this->hasMany('App\Models\InvoiceDetail');
    }
}
