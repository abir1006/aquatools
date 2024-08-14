<?php

namespace App\Tools\MTB;


class MtbModul
{

    public static $snittProduksjonstidManedValue = [];

    public static function startvekt()
    {
        return Snittvekt::biomasseSnitt();
    }

    public static function dogngrader()
    {
        return Oppdretter::snitttemp();
    }

    public static function vf3()
    {
        return Oppdretter::vf3();
    }

    public static function sluttvekt()
    {
        $first = pow(self::startvekt(), (1 / 3));
        $second = (self::vf3() / 1000) * self::dogngrader();
        $total = $first + $second;

        $result = pow($total, 3);
        return $result;
    }

    public static function tilvekst()
    {
        return self::sluttvekt() - self::startvekt();
    }

    public static function sgr()
    {
        //....multiply by 100...
        $match = self::startvekt() == 0 ? 0 : (self::tilvekst() / self::startvekt());
        return $match * 100;
    }

    public static function mtb()
    {
        return Oppdretter::mtbPerKons();
    }

    public static function mtbUtnytting()
    {
        return Oppdretter::mtbUtnytting() / 100;
    }

    public static function biomasse()
    {
        return self::mtb() * self::mtbUtnytting() * self::antallKons();
    }

    public static function svinn()
    {

        // $case_no = Oppdretter::caseNo();

        // store all case value of snittProduksjonstidManed from EM3
        // self::$snittProduksjonstidManedValue[$case_no] = EM3::snittProduksjonstidManed();

        //....divided by 100...
        // $svinnOutput = (Oppdretter::svinnManed() * 12) / 100;

//        if ($case_no > 1) {
//            $svinnOutput = $svinnOutput * (EM3::snittProduksjonstidManed() / self::$snittProduksjonstidManedValue[1]); // $case_no - 1
//        }

        return (Oppdretter::svinnManed() * 12) / 100;
    }

    public static function dager()
    {
        return 365;
    }

    public static function slakteutbytte()
    {
        return Oppdretter::konvetreringRundTilHOG();
    }

    public static function tonnProdusert()
    {
        //.......for match divided by 100 sgr.....
        return (self::sgr() / 100) * self::biomasse() * self::dager();
    }

    public static function dodeTonn()
    {
        // return self::tonnProdusert() * self::svinn(); // Arnfinn old mortality calculation
        return self::biomasse() * self::svinn(); // Arnfinn new mortality calculation
    }

    public static function tilSlaktTonn()
    {
        return self::tonnProdusert() - self::dodeTonn();
    }

    public static function utkastRundT()
    {
        return (self::tonnProdusert() - self::dodeTonn()) * (Oppdretter::utkast() / 100);
    }

    public static function slaktetRund()
    {
        return self::tilSlaktTonn() - self::utkastRundT();
    }

    public static function hogT()
    {
        return self::slaktetRund() * self::slakteutbytte();
    }

    public static function prodHogT()
    {
        return (self::hogT() * Oppdretter::prodKvalitet()) / 100;
    }

    public static function tonnPerKons()
    {
        return self::hogT() / self::antallKons();
    }

    public static function antallKons()
    {
        return Oppdretter::antallKonsesjoner();
    }

}
