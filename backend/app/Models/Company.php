<?php

namespace App\Models;

use App\Events\CompanyCreated;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    protected $fillable = [
        'name',
        'contact_person',
        'contact_person_last_name',
        'contact_number',
        'email',
        'status',
        'address_line_1',
        'address_line_2',
        'zip_code',
        'type',
        'currency',
        'number_of_licence',
        'logo',
        'country',
        'state',
        'city',
        'user_create',
        'is_trial_used',
        'expire_email_sent',
        'auth0_org_id'
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute()
    {
        if( $this->logo ) {
            return Storage::url('uploads/company_logo/' . $this->logo );
        }

        return '';
    }


//    protected $dispatchesEvents = [
//        'created' => CompanyCreated::class
//    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function tools()
    {
        return $this->hasMany('App\Models\CompanyTool');
    }

    public function addons()
    {
        return $this->hasMany('App\Models\CompanyAddon');
    }

    public function materials()
    {
        return $this->hasMany('App\Models\CompanyMaterial');
    }

    public function invoices()
    {
        return $this->hasMany('App\Models\Invoice');
    }

    public function users()
    {
        return $this->hasMany('App\Models\User');
    }

    public function temperatures()
    {
        return $this->hasMany('App\Models\Temperature');
    }


    public function lastInvoice()
    {
        $today_date = (new \DateTime())->format('Y-m-d');
        $instance = $this->hasMany('App\Models\Invoice');
        $instance->where('agreement_end_date', '>=', $today_date);
        $instance->orderBy('created_at', 'desc')->first();
        return $instance;
    }

}
