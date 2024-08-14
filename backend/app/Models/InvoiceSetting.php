<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Config;

class InvoiceSetting extends Model
{
    protected $table = 'invoice_settings';

    protected $fillable = ['type', 'currency', 'tool_price', 'add_on_price', 'user_price', 'status'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function setToolPriceAttribute($value)
    {
        $this->attributes['tool_price'] = json_encode($value);
    }

    public function setAddOnPriceAttribute($value)
    {
        $this->attributes['add_on_price'] = json_encode($value);
    }

    public function setUserPriceAttribute($value)
    {
        $this->attributes['user_price'] = json_encode($value);
    }

    public function getTypeAttribute($value)
    {
        $types = Config::get('settings.dropdown.subscription_duration');
        return $types[$value];
    }
}
