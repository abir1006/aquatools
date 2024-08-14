<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Temperature extends Model
{
    //
    protected $table = 'temperature_template';
    protected $fillable = ['name', 'template_data','user_id','company_id','tool_id'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function setTemplateDataAttribute($value)
    {
        $this->attributes['template_data'] = json_encode($value);
    }

    public function getTemplateDataAttribute($value)
    {
        return json_decode($value);
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }


    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id');
    }

    public function tool()
    {
        return $this->belongsTo('App\Models\Tool', 'tool_id');
    }



}
