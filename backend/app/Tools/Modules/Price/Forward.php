<?php


namespace App\Tools\Modules\Price;


class Forward
{
    /**
     * Cell H6
     *
     */
    public static function forwardLaksepris()
    {
        return ForwardData::lakesPris();
    }

    /**
     * Cell H7
     *
     */
    public static function justertForwardLaksepris()
    {
        return self::justertLaksepris();
    }

    /**
     * Cell D13
     *
     */
    public static function faktor3to4Kg()
    {
        return HistoriskData::fordelingPris3To4Kg() * self::forwardLaksepris() * 0.3;
    }

    /**
     * Cell D14
     *
     */
    public static function faktor4to5Kg()
    {
        return HistoriskData::fordelingPris4To5Kg() * self::forwardLaksepris() * 0.4;
    }

    /**
     * Cell D15
     *
     */
    public static function faktor5to6Kg()
    {
        return HistoriskData::fordelingPris5To6Kg() * self::forwardLaksepris() * 0.3;
    }

    /**
     * Cell D16
     *
     */
    public static function sumFaktor()
    {
        return self::faktor3to4Kg() + self::faktor4to5Kg() + self::faktor5to6Kg();
    }

    /**
     * Cell D20
     *
     */
    public static function justeringsfaktor()
    {
        return self::sumFaktor() == 0 ? 0 : (self::forwardLaksepris() / self::sumFaktor());
    }

    /**
     * Cell D21
     *
     */
    public static function justertLaksepris()
    {
        return self::forwardLaksepris() * self::justeringsfaktor();
    }

    /**
     * Cell F26
     *
     */
    public static function pris0to1Kg()
    {
        return Historisk::fordelingPris0To1() * Historisk::graph0To1();
    }

    /**
     * Cell F27
     *
     */
    public static function pris1to2Kg()
    {
        return Historisk::fordelingPris1To2() * Historisk::graph1To2() * self::justertForwardLaksepris();
    }

    /**
     * Cell F28
     *
     */
    public static function pris2to3Kg()
    {
        return Historisk::fordelingPris2To3() * Historisk::graph2To3() * self::justertForwardLaksepris();
    }

    /**
     * Cell F29
     *
     */
    public static function pris3to4Kg()
    {
        return Historisk::fordelingPris3To4() * Historisk::graph3To4() * self::justertForwardLaksepris();
    }

    /**
     * Cell F30
     *
     */
    public static function pris4to5Kg()
    {
        return Historisk::fordelingPris4To5() * Historisk::graph4To5() * self::justertForwardLaksepris();
    }

    /**
     * Cell F31
     *
     */
    public static function pris5to6Kg()
    {
        return Historisk::fordelingPris5To6() * Historisk::graph5To6() * self::justertForwardLaksepris();
    }

    /**
     * Cell F32
     *
     */
    public static function pris6to7Kg()
    {
        return Historisk::fordelingPris6To7() * Historisk::graph6To7() * self::justertForwardLaksepris();
    }

    /**
     * Cell F33
     *
     */
    public static function pris7to8Kg()
    {
        return Historisk::fordelingPris7To8() * Historisk::graph7To8() * self::justertForwardLaksepris();
    }

    /**
     * Cell F34
     *
     */
    public static function pris8to9Kg()
    {
        return Historisk::fordelingPris8To9() * Historisk::graph8To9() * self::justertForwardLaksepris();
    }

    /**
     * Cell F35
     *
     */
    public static function pris9plusKg()
    {
        return Historisk::fordelingPris9Plus() * Historisk::graph9Plus() * self::justertForwardLaksepris();
    }

    /**
     * Cell F37
     *
     */
    public static function snittpris()
    {
        return self::pris0to1Kg() + self::pris1to2Kg() + self::pris2to3Kg() + self::pris3to4Kg() + self::pris4to5Kg(
            ) + self::pris5to6Kg() + self::pris6to7Kg() + self::pris7to8Kg() + self::pris8to9Kg() + + self::pris9plusKg();
    }

}
