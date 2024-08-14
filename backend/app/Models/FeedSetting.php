<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class FeedSetting extends Model
{
    //

    protected $fillable = ['name', 'fields_data'];

    protected $casts = [
        'fields_data' => 'array'
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
