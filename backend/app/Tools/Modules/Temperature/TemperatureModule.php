<?php


namespace App\Tools\Modules\Price;


use App\Tools\ToolsOutputInterface;
use App\Services\TemperatureService;

class TemperatureModule
{




    public static function output($template_name, $week = 1)
    {

        // this method will return average temperature of a week from the database

        $template_name = 'Trondehum Aqua Site';
        $temp_service = self::temperatureService();
        $avg_temp = $temp_service->_getAvgTempByWeek($template_name,$week);



    }




}
