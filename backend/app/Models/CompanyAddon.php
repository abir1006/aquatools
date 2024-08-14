<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class CompanyAddon extends Model
{
    protected $fillable = ['company_id', 'addon_id' ,'status'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function addon()
    {
        return $this->belongsTo('App\Models\Addon');
    }

}
