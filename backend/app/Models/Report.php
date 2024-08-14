<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Report extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'file_name',
        'file_type',
        'customer',
        'consultant',
        'user_id',
        'company_id',
        'tool_id'
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function tool()
    {
        return $this->belongsTo('App\Models\Tool');
    }

    public function company()
    {
        return $this->belongsTo('App\Models\Company');
    }
}
