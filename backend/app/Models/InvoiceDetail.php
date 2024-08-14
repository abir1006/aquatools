<?php

namespace App\Models;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    protected $fillable = [
        'invoice_id',
        'item_name',
        'quantity',
        'unit_price',
        'discount_price',
        'status',
        'item_slug',
        'trial',
        'trial_start',
        'trial_end',
        'expire_email_sent'
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getTrialEndAttribute($value)
    {
        return $value == null ? null : (new Carbon($value))->format('d/m/Y');
    }

    public function getTrialStartAttribute($value)
    {
        return $value == null ? null : (new Carbon($value))->format('d/m/Y');
    }

    public function getTrialAttribute($value)
    {
        if ($value != null) {
            $date_arr = explode('/', $this->trial_end);
            $date = Carbon::parse($date_arr[2] . '-' . $date_arr[1] . '-' . $date_arr[0] . ' 23:59:59');
            $now = Carbon::now();
        }

        return $value == null ? '' : $date->diffInDays($now);
    }
}
