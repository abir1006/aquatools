<?php

namespace App\Tools\Vaccine;


use App\Tools\ToolsOutputInterface;

class VaccineArrayOutput implements ToolsOutputInterface
{
    public function formatOutput($data = array())
    {
        return $data;
    }
}
