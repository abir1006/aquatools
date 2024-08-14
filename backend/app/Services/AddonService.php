<?php

namespace App\Services;

use App\Models\Addon;
use Config;

class AddonService
{

    public function __construct()
    {

    }

    public function list()
    {
        return Addon::all();
    }

    public function save($data)
    {
        return Addon::create($data);
    }

    public function update($data)
    {
        $id = $data['id'];
        Addon::findOrFail($id)->update($data);
        return Addon::find($id);
    }

    public function delete($id)
    {
        return Addon::destroy($id);
    }


}
