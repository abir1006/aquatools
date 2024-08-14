<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Role_User extends Model
{
    protected $table = 'role_user';

    protected $fillable = ['user_id', 'role_id'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    public function role()
    {
        return $this->belongsTo('Kodeine\Acl\Models\Eloquent\Role', 'role_id');
    }

}
