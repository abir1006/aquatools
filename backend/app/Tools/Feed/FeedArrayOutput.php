<?php

namespace App\Tools\Feed;


use App\Tools\ToolsOutputInterface;

class FeedArrayOutput implements ToolsOutputInterface
{
    public function formatOutput($data = array())
    {
        return $data;
    }
}
