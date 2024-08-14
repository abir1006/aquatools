<?php

namespace App\Tools\MTB;

use App\Modules\PrisModule;
use App\Tools\ToolsOutputInterface;

class NRS
{
    public static $antallKonsesjoner;
    public static $mtbUtnytting1;
    public static $mtbUtnytting2;
    public static $snitttemp;
    public static $laksepris;
    public static $prisModule;


    /**
     * Method to setup inputs for Tools calculations
     * @param int $antallKonsesjoner
     * @param int $mtbUtnytting1
     * @param int $mtbUtnytting2
     * @param int $snitttemp
     */
    public static function setInputs(
        $antallKonsesjoner = 28,
        $mtbUtnytting1 = 84,
        $mtbUtnytting2 = 50,
        $snitttemp = 75,
        $laksepris = 'pris_module'
    ) {
        self::$antallKonsesjoner = $antallKonsesjoner;
        self::$mtbUtnytting1 = $mtbUtnytting1 / 100;
        self::$mtbUtnytting2 = $mtbUtnytting2 / 100;
        self::$snitttemp = $snitttemp / 10;
        self::$laksepris = $laksepris;
    }

    /**
     * @return mixed
     */
    public static function c4()
    {
        return self::$antallKonsesjoner;
    }

    /**
     * @return float|int
     */
    public static function d4()
    {
        return self::c4() * 780;
    }

    /**
     * @return mixed
     */
    public static function c6()
    {
        return self::$mtbUtnytting1;
    }

    /**
     * @return mixed
     */
    public static function c7()
    {
        return self::$mtbUtnytting2;
    }

    /**
     * @return mixed
     */
    public static function c8()
    {
        return self::$snitttemp;
    }

    /**
     * laksepris cell
     * dependency on PrisModule
     *
     *
     * @param PrisModule $prisModule
     * @return mixed
     */
    public static function c10(PrisModule $prisModule)
    {
        return self::$laksepris == 'pris_module' ? $prisModule->f23() : self::$laksepris;
    }

    /**
     * @return float|int
     */
    public static function k13()
    {
        return Kost::c36();
    }

    /**
     * @param ToolsOutputInterface $toolsOutput
     * @return array
     */
    public static function calculateOutput(ToolsOutputInterface $toolsOutput)
    {
        $outputData = array(
            2018 => array(
                'Tonn' => '',
                'Prodkost' => self::k13()
            ),
        );

        $outputData = $toolsOutput->formatOutput($outputData);

        return $outputData;
    }

}
