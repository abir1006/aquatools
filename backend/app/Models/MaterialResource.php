<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class MaterialResource extends Model
{
    protected $table = 'materials_resources';

    protected $fillable = ['file_name', 'file_type', 'is_default', 'caption', 'excerpt'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function material()
    {
        return $this->belongsTo('App\Models\Material', 'materials_id');
    }
}
