<?php


namespace App\Tools\Modules\Price;


use App\Tools\ExcelHelper;
use Excel;
use Illuminate\Support\Facades\Storage;

class HistoriskData
{

    public static $salmonNasdaqHistoricData;

    public static function snittpris()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            'Average Price',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AG3
    public static function fordelingPris1To2Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '1-2',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AH3
    public static function fordelingPris2To3Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '2-3',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AI3
    public static function fordelingPris3To4Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '3-4',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AJ3
    public static function fordelingPris4To5Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '4-5',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AK3
    public static function fordelingPris5To6Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '5-6',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AL3
    public static function fordelingPris6To7Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '6-7',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AM3
    public static function fordelingPris7To8Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '7-8',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AN3
    public static function fordelingPris8To9Kg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '8-9',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...AO3
    public static function fordelingPris9PlusKg()
    {
        return ExcelHelper::historicAverageIfs(
            self::$salmonNasdaqHistoricData,
            '9+',
            PriceModule::historicPeriodStart(),
            PriceModule::historicPeriodEnd()
        );
    }

    //...

    public static function setSalmonNasdaqHistoryData()
    {
        // $path = app_path() . '/Tools/Modules/Price/salmonprice/salmonIndexHistory.xls';
        $path = Storage::path('uploads/salmonprice/salmonIndexHistory.xls');
        $rows = Excel::toArray('', $path);
        $rows = $rows[0];

        $indexNames = [];

        foreach ($rows[5] as $key => $col) {
            if ($key <= 10) {
                $indexNames[] = $col;
            }

            if ($key == 21) {
                $indexNames[] = 'Average Price';
            }
        }

        unset($rows[0]);
        unset($rows[1]);
        unset($rows[2]);
        unset($rows[3]);
        unset($rows[4]);
        unset($rows[5]);

        $result = [];
        foreach ($rows as $rk => $row) {
            $count_cols = 0;
            foreach ($row as $ck => $col) {
                if ($ck <= 10 || $ck == 21) {
                    $result[$rk + 1][$indexNames[$count_cols]] = $col;
                    $count_cols++;
                }
            }

            $result[$rk + 1]['vekting']['1-2'] = $result[$rk + 1]['1-2'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['2-3'] = $result[$rk + 1]['2-3'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['3-4'] = $result[$rk + 1]['3-4'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['4-5'] = $result[$rk + 1]['4-5'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['5-6'] = $result[$rk + 1]['5-6'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['6-7'] = $result[$rk + 1]['6-7'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['7-8'] = $result[$rk + 1]['7-8'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['8-9'] = $result[$rk + 1]['8-9'] / $result[$rk + 1]['Average Price'];
            $result[$rk + 1]['vekting']['9+'] = !is_numeric(
                $result[$rk + 1]["9+"]
            ) ? 0 : $result[$rk + 1]["9+"] / $result[$rk + 1]['Average Price'];
        }

        self::$salmonNasdaqHistoricData = $result;
    }

}
