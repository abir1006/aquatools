<?php

namespace App\Models;

use App\Events\TemplateShared;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class TemplateShare extends Model
{
    protected $fillable = ['template_id', 'user_id', 'shared_by', 'is_remove', 'status', 'write_access'];

    protected $dispatchesEvents = [
        'created' => TemplateShared::class
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function template()
    {
        return $this->belongsTo('App\Models\Template');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function sharedBy()
    {
        return $this->belongsTo('App\Models\User', 'shared_by');
    }

}
