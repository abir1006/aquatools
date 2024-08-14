<?php

namespace App\Models;

use App\Notifications\MaterialAdded;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class Material extends Model
{
    protected $table = 'materials';
    protected $fillable = ['is_free', 'type', 'title', 'excerpt', 'details', 'price', 'is_default', 'category_id'];
    protected $appends = ['all_resources', 'default_resource_url'];
    protected $with = ['tools', 'tags', 'category'];

    protected $casts = [
        'price' => 'array',
        'is_default' => 'boolean',
        'is_free' => 'boolean'
    ];

    public static function boot()
    {
        parent::boot();
        self::deleting(function ($material) {
            $material->tools()->sync([]);
            return true;
        });
    }

    //events listener


    //scopes

    public function scopeByTools($query, $tools)
    {

        $ids = [];
        foreach ($tools as $key => $value) {
            array_push($ids, $value->tool->id);
        }

        return $query->whereHas('tools', function ($q) use ($ids) {
            $q->whereIn('tool_id', $ids);
        });
    }

    public function scopeFilter($query, $data)
    {
        $query->when(isset($data['category']) && strtolower($data['category']) != 'all', function ($q) use ($data) {

            return $q->where('category_id', $data['category']);
        });

        $query->when($data['is_free'] && !$data['is_paid'], function ($q) {

            return $q->where('is_free', 1);
        });

        $query->when($data['is_paid'] && !$data['is_free'], function ($q) {
            return $q->where('is_free', 0);
        });

        $search = $data['q'];
        $query->when($search, function ($q) use ($search) {
            return $q->where('title', 'iLike', '%' . $search . '%')
                ->orWhereHas('tags', function ($tq) use ($search) {
                    return $tq->where('name', 'iLike', '%' . $search . '%');
                });
        });

        return $query;
    }

    public function setPriceAttribute($value)
    {
        $prices = [];

        foreach ($value as $array_item) {
            if (!is_null($array_item['price'])) {
                $prices[] = $array_item;
            }
        }

        $this->attributes['price'] = json_encode($prices);
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }


    //relations

    public function category()
    {
        return $this->belongsTo('App\Models\MaterialCategory');
    }

    public function materialResources()
    {
        return $this->hasMany('App\Models\MaterialResource', 'materials_id')->orderBy('id');
    }

    public function tools()
    {
        return $this->belongsToMany('App\Models\Tool');
    }

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    //accessors

    public function getResourceObj($type, $resource)
    {
        $item = [
            'id' => $resource->id,
            'is_default' => $resource->is_default,
            'image' => $type == 'videos' ? $resource->file_name : Storage::url('uploads/materials/' . $resource->file_name),
            'caption' => $resource->caption,
            'excerpt' => $resource->excerpt

        ];

        if ($type == 'images')
            $item['thumbnail'] = Storage::url('uploads/materials/thumbnail/' . $resource->file_name);


        return $item;
    }
    public function getAllResourcesAttribute()
    {
        $images = [];

        foreach ($this->materialResources as $resource) {

            $ext = $resource->file_type;

            $type = 'images';

            if (in_array($ext, $this->videoType()))
                $type = 'videos';
            elseif (in_array($ext, $this->docType()))
                $type = 'documents';

            if ($resource->file_name) {

                if (in_array($ext, $this->imageType()))
                    $images[$type][] = $this->getResourceObj($type, $resource);
                else if (in_array($ext, $this->videoType())) {
                    $images[$type][] = $this->getResourceObj($type, $resource);
                } else
                    $images[$type][] = $this->getResourceObj($type, $resource);
            }
        }


        return $images;
    }

    public function getDefaultResourceUrlAttribute()
    {
        $url = '';

        foreach ($this->materialResources as $resource) {

            if ($resource->is_default && $resource->file_name && in_array($resource->file_type, $this->imageType())) {
                $url = Storage::url('uploads/materials/thumbnail/' . $resource->file_name);
                break;
            }
        }

        return $url;
    }

    public function getCategoryNameAttribute()
    {
        # code...
    }
    public static function imageType()
    {
        return ['jpeg', 'png', 'jpg', 'gif', 'svg'];
    }

    public static function videoType()
    {
        return ['vimeo', 'mp4', '3gp', 'flv', 'avi', 'mov'];
    }

    public static function docType()
    {
        return ['doc', 'docx', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx'];
    }

    public static function categories()
    {
        return ['Training', 'Fish Farming', 'Manual'];
    }
}
