<?php

namespace App\Models;

use App\Events\CompanyModelUpdated;
use App\Services\Auth0Services;
use DateTimeInterface;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Kodeine\Acl\Traits\HasRole;
use Illuminate\Auth\Passwords\CanResetPassword;

class User extends Authenticatable
{
    use Notifiable, HasRole;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'company_id',
        'status',
        'accept_cookie',
        'external_id'
    ];

    protected $appends = ['profile_pic_url', 'name', 'email', 'first_name', 'last_name'];

    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower($value);
    }

    public function getEmailAttribute()
    {
        return $this->external_id == '' ? '' : Auth0Services::getUserInfo($this->external_id)['email'];
    }

    public function getNameAttribute()
    {
        return $this->external_id == '' ? '' : Auth0Services::getUserInfo($this->external_id)['name'];
    }

    public function getFirstNameAttribute()
    {
        return $this->external_id == '' ? '' : explode(' ', Auth0Services::getUserInfo($this->external_id)['name'])[0];
    }

    public function getLastNameAttribute()
    {
        if ($this->external_id == '') {
            return '';
        }
        $name = Auth0Services::getUserInfo($this->external_id)['name'];
        return isset(explode(' ', $name)[1]) ? explode(' ', $name)[1] : '';
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id');
    }

    public function temperatures()
    {
        return $this->hasMany('App\Models\Temperature');
    }


    // public function roles()
    // {
    //     return $this->hasMany('App\Models\Role_User','user_id');
    // }

    public function isAdmin()
    {
        return $this->hasRole(config('settings.permission.super_admin_slug'));
    }

//    public function name()
//    {
//        return $this->last_name ? $this->first_name . ' ' . $this->last_name : $this->first_name;
//    }

    // get profile pic full url
    public function getProfilePicUrlAttribute(): string
    {
        if ($this->profile_pic) {
            return Storage::url('uploads/profile-pic/' . $this->profile_pic);
        }

        return '';
    }
}
