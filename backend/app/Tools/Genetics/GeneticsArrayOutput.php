<?php

namespace App\Tools\Genetics;


use App\Tools\ToolsOutputInterface;

class GeneticsArrayOutput implements ToolsOutputInterface
{
    public function formatOutput($data = array())
    {
        return $data;
    }
}
