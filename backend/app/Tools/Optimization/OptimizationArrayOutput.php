<?php

namespace App\Tools\Optimization;


use App\Tools\ToolsOutputInterface;

class OptimizationArrayOutput implements ToolsOutputInterface
{
    public function formatOutput($data = array())
    {
        return $data;
    }
}
