<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Permission_Role extends Model
{
	protected $table = 'permission_role';

    protected $fillable = ['permission_id', 'role_id'];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function permission()
    {
        return $this->belongsTo('Kodeine\Acl\Models\Eloquent\Permission','permission_id');
    }

    public function role()
    {
        return $this->belongsTo('Kodeine\Acl\Models\Eloquent\Role','role_id');
    }
}
