<?php

namespace App\Tools\Modules\bPLM_EM;

class TilTak
{
    private static $forkostValue = [];
    private static $caseNo;
    private static $forkost;
    private static $vaksine_kost_per_dose_nok;
    private static $vaksine_antall_doser_per_sjsatt_smolt_rpp;

    private static $tiltak_investeringskost_nok_1000;
    private static $tiltak_avskrivingstid_ar;
    private static $tiltak_restverdi;
    private static $tiltak_rente;
    private static $tiltak_tiltak_nok_1000_per_ar;
    private static $tiltak_ekstraordinre_kostnader_nok_1000_per_ar;
    private static $tiltak_merpris_for_nok_kg;

    public static function setInputs(
        $caseNo = 1,
        $vaksine_kost_per_dose_nok = null,
        $vaksine_antall_doser_per_sjsatt_smolt_rpp = null,
        $tiltak_investeringskost_nok_1000 = null,
        $tiltak_avskrivingstid_ar = null,
        $tiltak_restverdi = null,
        $tiltak_rente = null,
        $tiltak_tiltak_nok_1000_per_ar = null,
        $tiltak_ekstraordinre_kostnader_nok_1000_per_ar = null,
        $tiltak_merpris_for_nok_kg = null
    ) {
        self::$caseNo = $caseNo;
        self::$vaksine_kost_per_dose_nok = $vaksine_kost_per_dose_nok;
        self::$vaksine_antall_doser_per_sjsatt_smolt_rpp = $vaksine_antall_doser_per_sjsatt_smolt_rpp;
        self::$tiltak_investeringskost_nok_1000 = $tiltak_investeringskost_nok_1000;
        self::$tiltak_avskrivingstid_ar = $tiltak_avskrivingstid_ar;
        self::$tiltak_restverdi = $tiltak_restverdi;
        self::$tiltak_rente = $tiltak_rente;
        self::$tiltak_tiltak_nok_1000_per_ar = $tiltak_tiltak_nok_1000_per_ar;
        self::$tiltak_ekstraordinre_kostnader_nok_1000_per_ar = $tiltak_ekstraordinre_kostnader_nok_1000_per_ar;
        self::$tiltak_merpris_for_nok_kg = $tiltak_merpris_for_nok_kg;
    }

    public static function merprisFeedNOKPerKg()
    {
        if (BPLM::currentModel() !== 'Optimization') {
            return 0;
        }

        return self::$tiltak_merpris_for_nok_kg;
    }

    public static function vaksineKost()
    {
        if (BPLM::currentModel() === 'Optimization') {
            return 0;
        }

        if (BPLM::currentModel() === 'Feed') {
            return 0;
        }

        return BPLM::antallUtsatt(
            ) * self::$vaksine_kost_per_dose_nok * self::$vaksine_antall_doser_per_sjsatt_smolt_rpp;
    }

    public static function merprisGenetikkPerEgg()
    {
        if (BPLM::currentModel() != 'Genetics') {
            return 0;
        }

        return self::$tiltak_merpris_for_nok_kg;
    }

    public static function tiltakNOK1000PerAr()
    {
        if (in_array(BPLM::currentModel(), BPLM::$opt_gen_models)) {
            return self::$tiltak_tiltak_nok_1000_per_ar;
        }

        $prevCaseIndex = strtolower(BPLM::currentModel()) == 'vaccine' ? 2 : 1;
        self::$forkostValue[count(self::$forkostValue) + 1] = EM::forkost();

        if (self::$caseNo == $prevCaseIndex) {
            return 0;
        }

        return (EM::forkost() - self::$forkostValue[1]) / 1000;
    }

    public static function ekstraOrdinareKostnaderNOK1000PerAr()
    {
        if (in_array(BPLM::currentModel(), BPLM::$opt_gen_models)) {
            return self::$tiltak_ekstraordinre_kostnader_nok_1000_per_ar;
        }

        return 0;
    }

    public static function avskrivingPerAr()
    {
        if (in_array(BPLM::currentModel(), BPLM::$opt_gen_models)) {
            return self::$tiltak_avskrivingstid_ar == 0 ? 0 : (self::$tiltak_investeringskost_nok_1000 - self::restverdiNOK1000(
                    )) / self::$tiltak_avskrivingstid_ar;
        }

        return 0;
    }

    public static function restverdiNOK1000()
    {
        if (in_array(BPLM::currentModel(), BPLM::$opt_gen_models)) {
            return self::$tiltak_investeringskost_nok_1000 * (self::$tiltak_restverdi / 100);
        }

        return 0;
    }

    public static function kapitalgrunnlagNOK1000()
    {
        if (in_array(BPLM::currentModel(), BPLM::$opt_gen_models)) {
            return (self::$tiltak_investeringskost_nok_1000 + self::restverdiNOK1000()) / 2;
        }

        return 0;
    }

    public static function rentePerArNOK1000()
    {
        if (in_array(BPLM::currentModel(), BPLM::$opt_gen_models)) {
            return self::kapitalgrunnlagNOK1000() * (self::$tiltak_rente / 100);
        }

        return 0;
    }

    public static function sumInvesteringPerArNOK1000()
    {
        return self::avskrivingPerAr() + self::rentePerArNOK1000();
    }
}
