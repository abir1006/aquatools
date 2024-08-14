<?php

namespace App\Models;

use App\Events\CompanyModelUpdated;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class CompanyTool extends Model
{
    protected $fillable = ['company_id', 'tool_id' ,'status'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function tool()
    {
        return $this->belongsTo('App\Models\Tool');
    }
}
