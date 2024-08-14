<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    protected $fillable = ['name', 'slug', 'status', 'details'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function blocks()
    {
        return $this->hasMany('App\Models\Block')->orderBy('created_at', 'asc');
        //return $this->hasMany('App\Models\Block')->orderBy('created_at', 'desc');
    }

    public function temperatures()
    {
        return $this->hasMany('App\Models\Temperature');
    }
}
