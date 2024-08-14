<?php

namespace App\Models;

use DateTimeInterface;
use Kodeine\Acl\Models\Eloquent\Permission;

class ACLPermission extends Permission
{
	public function __construct()
    {
        parent::__construct();
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function setSlugAttribute($value)
    {
        // if nothing being set, clear slug
        if (empty($value)) {
            $this->attributes['slug'] = '[]';
            return ;
        }

        $value = is_array($value) ? $value : [$value => true];

        // if attribute is being updated.
        // if ( isset($this->original['slug']) ) {
        //     $value = $value + json_decode($this->original['slug'], true);

        //     // sort by key
        //     ksort($value);
        // }

        // remove null values.
        $value = array_filter($value, 'is_bool');

        // store as json.
        $this->attributes['slug'] = json_encode($value);
    }
}
