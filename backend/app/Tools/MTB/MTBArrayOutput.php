<?php

namespace App\Tools\MTB;


use App\Tools\ToolsOutputInterface;

class MTBArrayOutput implements ToolsOutputInterface
{
    public function formatOutput($data = array())
    {
        return $data;
    }
}
