<?php


namespace App\Tools\Modules\Price;

use App\Tools\ExcelHelper;
use Excel;
use Illuminate\Support\Facades\Storage;

class ForwardData
{
    public static $fishpoolForwardData;

    public static function lakesPris()
    {
        return ExcelHelper::forwardAverageIfs(
            self::$fishpoolForwardData,
            1,
            PriceModule::forwardPeriodStart(),
            PriceModule::forwardPeriodEnd()
        );
    }

    public static function setFishpoolForwardData()
    {
        // $path = app_path() . '/Tools/Modules/Price/salmonprice/Forwards_Report.xls';
        $path = Storage::path('uploads/salmonprice/Forwards_Report.xls');
        $rows = Excel::toArray('', $path);
        $rows = $rows[0];
        $last_index = count($rows) - 1;

        unset($rows[0]);
        unset($rows[1]);

        // Remove last row
        unset($rows[$last_index]);
        $result = array_values($rows);
        self::$fishpoolForwardData = $result;
    }
}
