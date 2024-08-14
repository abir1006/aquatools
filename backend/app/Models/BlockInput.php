<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class BlockInput extends Model
{
    protected $fillable = [
        'name',
        'line_divider',
        'slug',
        'block_id',
        'company_id',
        'default_data',
        'help_text',
        'status',
        'range_slider',
        'min_value',
        'max_value',
        'created_at',
        'divided_by',
        'input_order',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function setCompanyIdAttribute($value)
    {
        if (empty($value)) {
            $this->attributes['company_id'] = null;
        } else {
            $this->attributes['company_id'] = json_encode($value);
        }
    }

    public function getCompanyIdAttribute($value)
    {
        return json_decode($value);
    }

}
