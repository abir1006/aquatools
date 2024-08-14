<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    protected $fillable = ['name', 'slug', 'tool_id', 'is_default', 'status', 'case_type', 'column_no', 'has_cases', 'created_at'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function blockInputs()
    {
        return $this->hasMany('App\Models\BlockInput')
            ->orderBy('input_order', 'asc')
            ->orderBy('created_at', 'asc');
    }
}
