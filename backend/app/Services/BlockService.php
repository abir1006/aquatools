<?php

namespace App\Services;

use App\Models\Block;
use Config;

class BlockService
{

    public function __construct()
    {

    }

    public function list($data)
    {
        $tool_id = $data['tool_id'];
        // return Block::where('tool_id',$tool_id)
        //     ->orderBy('created_at', 'desc')
        //     ->get();

        return Block::where('tool_id',$tool_id)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function save($data)
    {
        $block = Block::create($data);
        return Block::find($block->id);
    }

    public function update($data)
    {
        $id = $data['id'];
        Block::findOrFail($id)->update($data);
        return Block::find($id);
    }

    public function delete($id)
    {
        //Block::findOrFail($id);
        return Block::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $company = Block::findOrFail($id);
        $company->status = $status;
        $company->save();

        return $company;
    }


}
