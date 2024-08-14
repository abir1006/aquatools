<?php

namespace App\Models;

use App\Events\TemplateCreated;
use App\Events\TemplateUpdated;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    protected $fillable = ['name', 'type', 'tool_id', 'template_data', 'user_id', 'status', 'updated_by'];

    protected $dispatchesEvents = [
        'created' => TemplateCreated::class,
        'updated' => TemplateUpdated::class,
    ];

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
        return $this->belongsTo('App\Models\User');
    }

    public function tool()
    {
        return $this->belongsTo('App\Models\Tool');
    }

    public function templateShares()
    {
        return $this->hasMany('App\Models\TemplateShare');
    }

}
