<?php

namespace App\Tools\Cod;


use App\Tools\ToolsOutputInterface;

class CodArrayOutput implements ToolsOutputInterface
{
    public function formatOutput($data = array())
    {
        return $data;
    }
}
