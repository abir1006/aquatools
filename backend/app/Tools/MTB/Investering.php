<?php


namespace App\Tools\MTB;


class Investering
{

    public static function investeringskostNOK1000()
    {
        return Oppdretter::investeringskostNOK1000();
    }

    public static function avskrivingstid()
    {
        return Oppdretter::avskrivingstid();
    }

    public static function restverdi()
    {
        return Oppdretter::restverdi();
    }

    public static function avskrivingPerAr()
    {
        return self::investeringskostNOK1000() / self::avskrivingstid();
    }


    public static function restverdiNok1000()
    {
        return self::investeringskostNOK1000() * self::restverdi();
    }

    public static function kapitalgrunnlag()
    {
        return (self::investeringskostNOK1000() - self::restverdiNok1000()) / 2;
    }

    public static function rente()
    {
        return Oppdretter::rente();
    }

    public static function rentePerAr()
    {
        return self::kapitalgrunnlag() * self::rente();
    }

    public static function sumInvesteringPerAr()
    {
        return self::avskrivingPerAr() + self::rentePerAr();
    }

    public static function tiltakNOK1000PerAr()
    {
        return Oppdretter::tiltakNOK1000PerAr();
    }

    public static function ekstraordinreKostnaderNOK1000PerAr()
    {
        return Oppdretter::ekstraordinreKostnaderNOK1000PerAr();
    }


    //.........case 2 start............
    public static function merprisForNokKg()
    {
        return Oppdretter::merprisForNokKg();
    }
    //.........case 2 end............

}
