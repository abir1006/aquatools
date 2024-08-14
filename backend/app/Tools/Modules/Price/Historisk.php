<?php


namespace App\Tools\Modules\Price;

use App\Tools\ExcelHelper;


class Historisk
{
    //...H6
    public static function gjennomsnittligLaksepris()
    {
        return HistoriskData::snittpris();
    }

    //...B14
    public static function snittvekt0To1()
    {
        return 1;
    }

    //...B15
    public static function snittvekt1To2()
    {
        return 2;
    }

    //...B16
    public static function snittvekt2To3()
    {
        return 3;
    }

    //...B17
    public static function snittvekt3To4()
    {
        return 4;
    }

    //...B18
    public static function snittvekt4To5()
    {
        return 5;
    }

    //...B19
    public static function snittvekt5To6()
    {
        return 6;
    }

    //...B20
    public static function snittvekt6To7()
    {
        return 7;
    }

    //...B21
    public static function snittvekt7To8()
    {
        return 8;
    }

    //...B22
    public static function snittvekt8To9()
    {
        return 9;
    }

    //...B23
    public static function snittvekt9Plus()
    {
        return 13;
    }

    //...........graph part start..............
    //...C14
    public static function graph0To1()
    {
        $x = self::getXValue(self::snittvekt0To1());
        return ExcelHelper::normsdist($x);
    }

    //...C15
    public static function graph1To2()
    {
        $x = self::getXValue(self::snittvekt1To2());
        $y = self::getXValue(self::snittvekt0To1());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C16
    public static function graph2To3()
    {
        $x = self::getXValue(self::snittvekt2To3());
        $y = self::getXValue(self::snittvekt1To2());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C17
    public static function graph3To4()
    {
        $x = self::getXValue(self::snittvekt3To4());
        $y = self::getXValue(self::snittvekt2To3());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C18
    public static function graph4To5()
    {
        $x = self::getXValue(self::snittvekt4To5());
        $y = self::getXValue(self::snittvekt3To4());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C19
    public static function graph5To6()
    {
        $x = self::getXValue(self::snittvekt5To6());
        $y = self::getXValue(self::snittvekt4To5());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C20
    public static function graph6To7()
    {
        $x = self::getXValue(self::snittvekt6To7());
        $y = self::getXValue(self::snittvekt5To6());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C21
    public static function graph7To8()
    {
        $x = self::getXValue(self::snittvekt7To8());
        $y = self::getXValue(self::snittvekt6To7());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C22
    public static function graph8To9()
    {
        $x = self::getXValue(self::snittvekt8To9());
        $y = self::getXValue(self::snittvekt7To8());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    //...C23
    public static function graph9Plus()
    {
        $x = self::getXValue(self::snittvekt9Plus());
        $y = self::getXValue(self::snittvekt8To9());
        return ExcelHelper::normsdist($x) - ExcelHelper::normsdist($y);
    }

    public static function getXValue($s = 1)
    {
        return ($s - PriceModule::snittvekt()) / (PriceModule::cv() * PriceModule::snittvekt() / 100);
    }

    //...........graph part end..............


    //...E14
    public static function fordelingPris0To1()
    {
        return 0;
    }

    //...E15
    public static function fordelingPris1To2()
    {
        return HistoriskData::fordelingPris1To2Kg();
    }

    //...E16
    public static function fordelingPris2To3()
    {
        return HistoriskData::fordelingPris2To3Kg();
    }

    //...E17
    public static function fordelingPris3To4()
    {
        return HistoriskData::fordelingPris3To4Kg();
    }

    //...E18
    public static function fordelingPris4To5()
    {
        return HistoriskData::fordelingPris4To5Kg();
    }

    //...E19
    public static function fordelingPris5To6()
    {
        return HistoriskData::fordelingPris5To6Kg();
    }

    //...E20
    public static function fordelingPris6To7()
    {
        return HistoriskData::fordelingPris6To7Kg();
    }

    //...E21
    public static function fordelingPris7To8()
    {
        return HistoriskData::fordelingPris7To8Kg();
    }

    //...E22
    public static function fordelingPris8To9()
    {
        return HistoriskData::fordelingPris8To9Kg();
    }

    //...E23
    public static function fordelingPris9Plus()
    {
        return HistoriskData::fordelingPris9PlusKg();
    }

    //...F14
    public static function pris0To1()
    {
        return self::graph0To1() * self::fordelingPris0To1();
    }

    //...F15
    public static function pris1To2()
    {
        return self::graph1To2() * self::fordelingPris1To2() * self::gjennomsnittligLaksepris();
    }

    //...F16
    public static function pris2To3()
    {
        return self::graph2To3() * self::fordelingPris2To3() * self::gjennomsnittligLaksepris();
    }

    //...F17
    public static function pris3To4()
    {
        return self::graph3To4() * self::fordelingPris3To4() * self::gjennomsnittligLaksepris();
    }

    //...F18
    public static function pris4To5()
    {
        return self::graph4To5() * self::fordelingPris4To5() * self::gjennomsnittligLaksepris();
    }

    //...F19
    public static function pris5To6()
    {
        return self::graph5To6() * self::fordelingPris5To6() * self::gjennomsnittligLaksepris();
    }

    //...F20
    public static function pris6To7()
    {
        return self::graph6To7() * self::fordelingPris6To7() * self::gjennomsnittligLaksepris();
    }

    //...F21
    public static function pris7To8()
    {
        return self::graph7To8() * self::fordelingPris7To8() * self::gjennomsnittligLaksepris();
    }

    //...F22
    public static function pris8To9()
    {
        return self::graph8To9() * self::fordelingPris8To9() * self::gjennomsnittligLaksepris();
    }

    //...F23
    public static function pris9Plus()
    {
        return self::graph9Plus() * self::fordelingPris9Plus() * self::gjennomsnittligLaksepris();
    }

    //...F25
    public static function snittpris()
    {
        return self::pris1To2() + self::pris2To3() + self::pris3To4() + self::pris4To5() + self::pris5To6(
            ) + self::pris6To7() + self::pris7To8() + self::pris8To9() + self::pris9Plus();
    }

}
