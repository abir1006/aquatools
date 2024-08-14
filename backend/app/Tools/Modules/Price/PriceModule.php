<?php


namespace App\Tools\Modules\Price;


use App\Tools\ToolsOutputInterface;
use phpDocumentor\Reflection\Types\Self_;

class PriceModule
{
    public static $case_no;
    public static $price_type;

    public static $historic_period_start;
    public static $historic_period_end;
    public static $forward_period_start;
    public static $forward_period_end;
    public static $snittvekt;
    public static $cv;
    private static $lakse_pris_percentage;

    private static $outputValue = [];

    public static function setInputs(
        $case_no = 4,
        $price_type = 'Historisk',
        $historic_period_start = 201901,
        $historic_period_end = 201952,
        $forward_period_start = 202101,
        $forward_period_end = 202112,
        $snittvekt = 8,
        $cv = 22,
        $lakse_pris_percentage = 100
    )
    {
        self::$case_no = $case_no;
        self::$price_type = $price_type;
        self::$historic_period_start = $historic_period_start;
        self::$historic_period_end = $historic_period_end;
        self::$forward_period_start = $forward_period_start;
        self::$forward_period_end = $forward_period_end;
        self::$snittvekt = $snittvekt;
        self::$cv = $cv;
        self::$lakse_pris_percentage = $lakse_pris_percentage;
    }

    public static function caseNo()
    {
        return self::$case_no;
    }

    public static function priceType()
    {
        return self::$price_type;
    }

    public static function historicPeriodStart()
    {
        return self::$historic_period_start;
    }

    public static function historicPeriodEnd()
    {
        return self::$historic_period_end;
    }

    public static function forwardPeriodStart()
    {
        return self::$forward_period_start;
    }

    public static function forwardPeriodEnd()
    {
        return self::$forward_period_end;
    }

    public static function snittvekt()
    {
        return self::$snittvekt;
    }

    public static function cv()
    {
        return self::$cv;
    }

    public static function output()
    {
        $price_type = self::priceType();

        if ($price_type == 'Historic') {
            self::$outputValue[self::caseNo()] = Historisk::snittpris();
            return Historisk::snittpris() * (self::$lakse_pris_percentage / 100);
        } else {
            self::$outputValue[self::caseNo()] = Forward::snittpris();
            return Forward::snittpris() * (self::$lakse_pris_percentage / 100);
        }
    }

    public static function verdi()
    {
        $caseNo = self::caseNo();
        if ($caseNo > 1) {
            return self::output() - self::$outputValue[1];
        }

        return 0;
    }

    //.............debug start..............
    public static function historiskDebug()
    {
        $result = [];
        $class_methods = get_class_methods(new Historisk());
        foreach ($class_methods as $method_name) {
            $result[$method_name] = Historisk::$method_name();
        }
        return $result;
    }

    public static function historiskDataDebug()
    {
        $result = [];
        $class_methods = get_class_methods(new HistoriskData());
        foreach ($class_methods as $method_name) {
            $result[$method_name] = HistoriskData::$method_name();
        }
        return $result;
    }

    public static function forwardDebug()
    {
        $result = [];
        $class_methods = get_class_methods(new Forward());
        foreach ($class_methods as $method_name) {
            $result[$method_name] = Forward::$method_name();
        }
        return $result;
    }

    public static function forwardDataDebug()
    {
        $result = [];
        $class_methods = get_class_methods(new ForwardData());
        foreach ($class_methods as $method_name) {
            $result[$method_name] = ForwardData::$method_name();
        }
        return $result;
    }

    //.............debug end..............

    public static function calculateOutput(ToolsOutputInterface $toolsOutput)
    {
        $outputData['result']['snittpris'] = number_format(self::output(), 2);
        $outputData['result']['verdi'] = number_format(self::verdi(), 2);

        $historic_start_year = array_values(HistoriskData::$salmonNasdaqHistoricData)[0]['Year'];
        $historic_end_year = array_values(array_slice(HistoriskData::$salmonNasdaqHistoricData, -1, 1, true))[0]['Year'];
        $excel_start_week = array_values(HistoriskData::$salmonNasdaqHistoricData)[0]['Week'];
        $excel_end_week = array_values(array_slice(HistoriskData::$salmonNasdaqHistoricData, -1, 1, true))[0]['Week'];

        if (self::priceType() === 'Historic') {
            $outputData['result']['gjennomsnittligLaksepris'] = number_format(Historisk::gjennomsnittligLaksepris(), 2);
            $outputData['result']['historic_start_year'] = $historic_start_year;
            $outputData['result']['historic_start_week'] = $excel_start_week;
            $outputData['result']['historic_end_year'] = $historic_end_year;
            $outputData['result']['historic_end_week'] = $excel_end_week;
        } else {
            $start_year_month = ForwardData::$fishpoolForwardData[0][0];
            $last_index = count(ForwardData::$fishpoolForwardData)-1;
            $end_year_month = ForwardData::$fishpoolForwardData[$last_index][0];
            $excel_start_year =  explode('-', $start_year_month)[0];
            $excel_start_month = explode('-', $start_year_month)[1];
            $excel_end_year =  explode('-', $end_year_month)[0];
            $excel_end_month = explode('-', $end_year_month)[1];
            $outputData['result']['forwardLaksepris'] = number_format(Forward::forwardLaksepris(), 3);
            $outputData['result']['justertForwardLaksepris'] = number_format(Forward::justertForwardLaksepris(), 3);
            $outputData['result']['historic_start_year'] = $historic_start_year;
            $outputData['result']['historic_start_week'] = $excel_start_week;
            $outputData['result']['historic_end_year'] = $historic_end_year;
            $outputData['result']['historic_end_week'] = $excel_end_week;
            $outputData['result']['forward_start_year'] = $excel_start_year;
            $outputData['result']['forward_start_month'] = $excel_start_month;
            $outputData['result']['forward_end_year'] = $excel_end_year;
            $outputData['result']['forward_end_month'] = $excel_end_month;
        }

        $outputData = $toolsOutput->formatOutput($outputData);

        return $outputData;
    }


    public static function calculateOutputTest(ToolsOutputInterface $toolsOutput)
    {
        $outputData['result']['snittpris'] = number_format(self::output(), 2);
        $outputData['result']['verdi'] = number_format(self::verdi(), 2);

        if (self::priceType() === 'Historic') {
            $outputData['result']['gjennomsnittligLaksepris'] = number_format(Historisk::gjennomsnittligLaksepris(), 2);
            $outputData['historisk'] = self::historiskDebug();
            $outputData['historiskData'] = self::historiskDataDebug();
        } else {
            $outputData['result']['forwardLaksepris'] = number_format(Forward::forwardLaksepris(), 3);
            $outputData['result']['justertForwardLaksepris'] = number_format(Forward::justertForwardLaksepris(), 3);
            $outputData['forward'] = self::forwardDebug();
            $outputData['forwardData'] = self::forwardDataDebug();
        }

        $outputData = $toolsOutput->formatOutput($outputData);

        return $outputData;
    }


}
