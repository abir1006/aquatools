<?php

namespace App\Services;

use App\Models\Block;
use App\Models\Tool;
use Config;

class MTBService
{

    public function __construct()
    {

    }

    public function blockList($data)
    {
        $tool_slug = $data['tool_slug'];
        $company_id = $data['company_id'];

        // return Block::with(['blockInputs' => function ($query) use ($company_id) {
        //         $query->where('company_id', $company_id);
        //         $query->orWhereNull("company_id");
        //     }])
        //     ->where('tool_id', $tool_id)
        //     ->orderBy('created_at', 'desc')
        //     ->get();

        // return Block::with(['blockInputs' => function ($query) use ($company_id) {
        //         $query->whereJsonContains('company_id', $company_id);
        //         $query->orWhereNull("company_id");
        //     }])
        //     ->where('tool_id', $tool_id)
        //     ->orderBy('created_at', 'desc')
        //     ->get();


        // return Tool::with(['blocks.blockInputs' => function ($query) use ($company_id) {
        //         $query->whereJsonContains('company_id', $company_id);
        //         $query->orWhereNull("company_id");
        //     }],['blocks'])
        //     ->where('slug', $tool_slug)
        //     ->orderBy('created_at', 'desc')
        //     ->get();



        return Tool::with(['blocks.blockInputs'],['blocks'])
            ->where('slug', $tool_slug)
            //->orderBy('created_at', 'desc')
            ->get();



    }


}
