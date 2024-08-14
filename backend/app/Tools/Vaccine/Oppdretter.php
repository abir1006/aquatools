<?php

namespace App\Tools\Vaccine;

use App\Modules\PrisModule;
use App\Tools\Modules\bPLM_EM\BPLM;
use App\Tools\Modules\bPLM_EM\EM;
use App\Tools\ToolsOutputInterface;

class Oppdretter
{
    public static $model = 'Vaccine';
    public static $case_no;
    public static $lokalitet;
    public static $generasjon;
    public static $navn;

    public static $antall_smolt;
    public static $laksepris;
    public static $prod_kost_budsjett;

    public static $budsjett_simulering;
    public static $budsjett_smoltvekt_gram;
    public static $budsjett_slaktevekt_rund_kg;
    public static $budsjett_ddelighet_budsjett_percentage;
    public static $budsjett_snittvekt_ddfisk_kg;
    public static $budsjett_bfcr;
    public static $budsjett_forpris_snitt_kr_kg;
    public static $budsjett_nedklassing_prod_percentage;
    public static $budsjett_kostnad_ddfisk_kr_per_kg;
    public static $budsjett_transport_slakt_kr_per_kg_rund;
    public static $budsjett_slaktekost_per_kg_slyd;
    public static $budsjett_redusert_pris_prod_per_kg;
    public static $budsjett_omregningsfaktor_rund_slyd;
    public static $budsjett_smolt_pris_nok_per_stk;
    public static $budsjett_utkast;
    public static $budsjett_cv;

    public static $sjukdom_name;
    public static $sjukdom_redusert_slaktevekt_kg;
    public static $sjukdom_kt_ddelighet_prosentpoeng;
    public static $sjukdom_vekt_pa_ddfisk;
    public static $sjukdom_kt_bfcr;
    public static $sjukdom_kt_nedklassing_prod_kvalitet;
    public static $sjukdom_utkast_poeng;
    public static $sjukdom_ekstraordinre_kostnader_nok_mill;
    public static $sjukdom_behandlingskostnad_nok_mill;
    public static $sjukdom_forebygginskostnad_nok_mill;
    public static $sjukdom_sannsynlighet_for_sjukdom;
    public static $sjukdom_kt_cv;

    public static $vaksine_tilvekst_kg_rpp;
    public static $vaksine_tilvekst_kg_bi_effekt;
    public static $vaksine_ddelighet_poeng_rpp;
    public static $vaksine_ddelighet_poeng_bi_effekt;
    public static $vaksine_bfcr_enhet_rpp;
    public static $vaksine_bfcr_enhet_bi_effekt;
    public static $vaksine_produksjon_poeng_rpp;
    public static $vaksine_produksjon_poeng_bi_effekt;
    public static $vaksine_utkast_poeng_rpp;
    public static $vaksine_utkast_poeng_bi_effekt;
    public static $vaksine_ekstraordinre_kostnader_rpp;
    public static $vaksine_behandling_rpp;
    public static $vaksine_forebygging_rpp;
    public static $vaksine_kost_per_dose_nok;
    public static $vaksine_antall_doser_per_sjsatt_smolt_rpp;
    public static $vaksine_sannsynlighet_for_sjukdom_rpp;
    public static $vaksine_cv_rpp;
    public static $vaksine_cv_bi_effekt;

    private static $solgtBiomasseTotHOGvalue = [];

    public static $values = [];


    public static function setInputs(
        $case_no = 1,
        $lokalitet = '',
        $generasjon = '',
        $navn = '',
        $antall_smolt = 866000,
        $laksepris = 80,
        $prod_kost_budsjett = 40,
        $budsjett_simulering = '',
        $budsjett_smoltvekt_gram = 120,
        $budsjett_slaktevekt_rund_kg = 5.5,
        $budsjett_ddelighet_budsjett_percentage = 15,
        $budsjett_snittvekt_ddfisk_kg = 2.1,
        $budsjett_bfcr = 1.15,
        $budsjett_forpris_snitt_kr_kg = 10,
        $budsjett_nedklassing_prod_percentage = 3.0,
        $budsjett_kostnad_ddfisk_kr_per_kg = 2,
        $budsjett_transport_slakt_kr_per_kg_rund = 0.75,
        $budsjett_slaktekost_per_kg_slyd = 3.50,
        $budsjett_redusert_pris_prod_per_kg = 7.00,
        $budsjett_omregningsfaktor_rund_slyd = 0.86,
        $budsjett_smolt_pris_nok_per_stk = 14,
        $budsjett_utkast = 50,
        $budsjett_cv = 22,

        $sjukdom_name = '',
        $sjukdom_redusert_slaktevekt_kg = 2.70,
        $sjukdom_kt_ddelighet_prosentpoeng = 35,
        $sjukdom_vekt_pa_ddfisk = 4.30,
        $sjukdom_kt_bfcr = 0.05,
        $sjukdom_kt_nedklassing_prod_kvalitet = 13.80,
        $sjukdom_utkast_poeng = 2.00,
        $sjukdom_ekstraordinre_kostnader_nok_mill = 6.60,
        $sjukdom_behandlingskostnad_nok_mill = 11.80,
        $sjukdom_forebygginskostnad_nok_mill = 5.00,
        $sjukdom_sannsynlighet_for_sjukdom = .5,
        $sjukdom_kt_cv = 22,

        $vaksine_tilvekst_kg_rpp = 40.0,
        $vaksine_tilvekst_kg_bi_effekt = 0,
        $vaksine_ddelighet_poeng_rpp = 40.0,
        $vaksine_ddelighet_poeng_bi_effekt = 0,
        $vaksine_bfcr_enhet_rpp = 40.00,
        $vaksine_bfcr_enhet_bi_effekt = 0,
        $vaksine_produksjon_poeng_rpp = 40.0,
        $vaksine_produksjon_poeng_bi_effekt = 0,
        $vaksine_utkast_poeng_rpp = 40.00,
        $vaksine_utkast_poeng_bi_effekt = 0,
        $vaksine_ekstraordinre_kostnader_rpp = 40.00,
        $vaksine_behandling_rpp = 40.00,
        $vaksine_forebygging_rpp = 40.00,
        $vaksine_kost_per_dose_nok = 2,
        $vaksine_antall_doser_per_sjsatt_smolt_rpp = 1.05,
        $vaksine_sannsynlighet_for_sjukdom_rpp = 100,
        $vaksine_cv_rpp = 22,
        $vaksine_cv_bi_effekt = 1,
        $model = 'Vaccine'

    ) {
        // logger(self::caseNo());
        //logger(get_defined_vars());
        self::$case_no = $case_no;
        self::$lokalitet = $lokalitet;
        self::$generasjon = $generasjon;
        self::$navn = $navn;
        self::$antall_smolt = $antall_smolt;
        self::$laksepris = $laksepris;
        self::$prod_kost_budsjett = $prod_kost_budsjett;

        self::$budsjett_simulering = $budsjett_simulering;
        self::$budsjett_smoltvekt_gram = $budsjett_smoltvekt_gram;
        self::$budsjett_slaktevekt_rund_kg = $budsjett_slaktevekt_rund_kg;
        self::$budsjett_ddelighet_budsjett_percentage = $budsjett_ddelighet_budsjett_percentage;
        self::$budsjett_snittvekt_ddfisk_kg = $budsjett_snittvekt_ddfisk_kg;
        self::$budsjett_bfcr = $budsjett_bfcr;
        self::$budsjett_forpris_snitt_kr_kg = $budsjett_forpris_snitt_kr_kg;
        self::$budsjett_nedklassing_prod_percentage = $budsjett_nedklassing_prod_percentage;
        self::$budsjett_kostnad_ddfisk_kr_per_kg = $budsjett_kostnad_ddfisk_kr_per_kg;
        self::$budsjett_transport_slakt_kr_per_kg_rund = $budsjett_transport_slakt_kr_per_kg_rund;
        self::$budsjett_slaktekost_per_kg_slyd = $budsjett_slaktekost_per_kg_slyd;
        self::$budsjett_redusert_pris_prod_per_kg = $budsjett_redusert_pris_prod_per_kg;
        self::$budsjett_omregningsfaktor_rund_slyd = $budsjett_omregningsfaktor_rund_slyd;
        self::$budsjett_smolt_pris_nok_per_stk = $budsjett_smolt_pris_nok_per_stk;
        self::$budsjett_utkast = $budsjett_utkast;
        self::$budsjett_cv = $budsjett_cv;

        self::$sjukdom_name = $sjukdom_name;
        self::$sjukdom_redusert_slaktevekt_kg = $sjukdom_redusert_slaktevekt_kg;
        self::$sjukdom_kt_ddelighet_prosentpoeng = $sjukdom_kt_ddelighet_prosentpoeng;
        self::$sjukdom_vekt_pa_ddfisk = $sjukdom_vekt_pa_ddfisk;
        self::$sjukdom_kt_bfcr = $sjukdom_kt_bfcr;
        self::$sjukdom_kt_nedklassing_prod_kvalitet = $sjukdom_kt_nedklassing_prod_kvalitet;
        self::$sjukdom_utkast_poeng = $sjukdom_utkast_poeng;
        self::$sjukdom_ekstraordinre_kostnader_nok_mill = $sjukdom_ekstraordinre_kostnader_nok_mill;
        self::$sjukdom_behandlingskostnad_nok_mill = $sjukdom_behandlingskostnad_nok_mill;
        self::$sjukdom_forebygginskostnad_nok_mill = $sjukdom_forebygginskostnad_nok_mill;
        self::$sjukdom_sannsynlighet_for_sjukdom = $sjukdom_sannsynlighet_for_sjukdom;
        self::$sjukdom_kt_cv = $sjukdom_kt_cv;

        self::$vaksine_tilvekst_kg_rpp = $vaksine_tilvekst_kg_rpp;
        self::$vaksine_tilvekst_kg_bi_effekt = $vaksine_tilvekst_kg_bi_effekt;
        self::$vaksine_ddelighet_poeng_rpp = $vaksine_ddelighet_poeng_rpp;
        self::$vaksine_ddelighet_poeng_bi_effekt = $vaksine_ddelighet_poeng_bi_effekt;
        self::$vaksine_bfcr_enhet_rpp = $vaksine_bfcr_enhet_rpp;
        self::$vaksine_bfcr_enhet_bi_effekt = $vaksine_bfcr_enhet_bi_effekt;
        self::$vaksine_produksjon_poeng_rpp = $vaksine_produksjon_poeng_rpp;
        self::$vaksine_produksjon_poeng_bi_effekt = $vaksine_produksjon_poeng_bi_effekt;
        self::$vaksine_utkast_poeng_rpp = $vaksine_utkast_poeng_rpp;
        self::$vaksine_utkast_poeng_bi_effekt = $vaksine_utkast_poeng_bi_effekt;
        self::$vaksine_ekstraordinre_kostnader_rpp = $vaksine_ekstraordinre_kostnader_rpp;
        self::$vaksine_behandling_rpp = $vaksine_behandling_rpp;
        self::$vaksine_forebygging_rpp = $vaksine_forebygging_rpp;
        self::$vaksine_kost_per_dose_nok = $vaksine_kost_per_dose_nok;
        self::$vaksine_antall_doser_per_sjsatt_smolt_rpp = $vaksine_antall_doser_per_sjsatt_smolt_rpp;
        self::$vaksine_sannsynlighet_for_sjukdom_rpp = $vaksine_sannsynlighet_for_sjukdom_rpp;
        self::$vaksine_cv_rpp = $vaksine_cv_rpp;
        self::$vaksine_cv_bi_effekt = $vaksine_cv_bi_effekt;
        self::$model = $model;
    }


    //CASE 3
    public static function vaksine_cv_bi_effekt()
    {
        return self::$vaksine_cv_bi_effekt;
    }

    public static function vaksine_cv_rpp()
    {
        return self::$vaksine_cv_rpp / 100;
    }

    public static function vaksine_sannsynlighet_for_sjukdom_rpp()
    {
        return self::$vaksine_sannsynlighet_for_sjukdom_rpp / 100;
    }

    public static function vaksine_antall_doser_per_sjsatt_smolt_rpp()
    {
        return self::$vaksine_antall_doser_per_sjsatt_smolt_rpp / 100;
    }

    public static function vaksine_kost_per_dose_nok()
    {
        return self::$vaksine_kost_per_dose_nok;
    }


    public static function vaksine_forebygging_rpp()
    {
        return self::$vaksine_forebygging_rpp / 100;
    }

    public static function vaksine_behandling_rpp()
    {
        return self::$vaksine_behandling_rpp / 100;
    }

    public static function vaksine_ekstraordinre_kostnader_rpp()
    {
        return self::$vaksine_ekstraordinre_kostnader_rpp / 100;
    }

    public static function vaksine_utkast_poeng_bi_effekt()
    {
        return self::$vaksine_utkast_poeng_bi_effekt / 100;
    }


    public static function vaksine_utkast_poeng_rpp()
    {
        return self::$vaksine_utkast_poeng_rpp / 100;
    }

    public static function vaksine_produksjon_poeng_bi_effekt()
    {
        return self::$vaksine_produksjon_poeng_bi_effekt / 100;
    }


    public static function vaksine_produksjon_poeng_rpp()
    {
        return self::$vaksine_produksjon_poeng_rpp / 100;
    }


    public static function vaksine_bfcr_enhet_bi_effekt()
    {
        return self::$vaksine_bfcr_enhet_bi_effekt;
    }


    public static function vaksine_bfcr_enhet_rpp()
    {
        return self::$vaksine_bfcr_enhet_rpp / 100;
    }


    public static function vaksine_ddelighet_poeng_bi_effekt()
    {
        return self::$vaksine_ddelighet_poeng_bi_effekt / 100;
    }

    public static function vaksine_ddelighet_poeng_rpp()
    {
        return self::$vaksine_ddelighet_poeng_rpp / 100;
    }


    public static function vaksine_tilvekst_kg_bi_effekt()
    {
        return self::$vaksine_tilvekst_kg_bi_effekt;
    }


    public static function vaksine_tilvekst_kg_rpp()
    {
        return self::$vaksine_tilvekst_kg_rpp / 100;
    }


    //CASE 2

    public static function sjukdom_kt_cv()
    {
        return self::$sjukdom_kt_cv;
    }

    public static function sjukdom_sannsynlighet_for_sjukdom()
    {
        return self::$sjukdom_sannsynlighet_for_sjukdom / 100;
    }

    public static function sjukdom_utkast_percentange()
    {
        return self::$sjukdom_utkast_poeng / 100;
    }


    public static function sjukdom_forebygginskostnad_nok_mill()
    {

        return self::$sjukdom_forebygginskostnad_nok_mill * 1000;
    }


    public static function sjukdom_behandlingskostnad_nok_mill()
    {
        return self::$sjukdom_behandlingskostnad_nok_mill * 1000;
    }

    public static function sjukdom_ekstraordinre_kostnader_nok_mill()
    {
        return self::$sjukdom_ekstraordinre_kostnader_nok_mill * 1000;
    }


    public static function sjukdom_utkast_poeng()
    {
        return self::$sjukdom_utkast_poeng / 100;
    }

    public static function sjukdom_kt_nedklassing_prod_kvalitet()
    {
        return self::$sjukdom_kt_nedklassing_prod_kvalitet / 100;
    }

    public static function sjukdom_kt_bfcr()
    {
        return self::$sjukdom_kt_bfcr;
    }

    public static function sjukdom_vekt_pa_ddfisk()
    {
        return self::$sjukdom_vekt_pa_ddfisk;
    }


    public static function sjukdom_kt_ddelighet_prosentpoeng()
    {
        return self::$sjukdom_kt_ddelighet_prosentpoeng / 100;
    }

    // Return negative value
    public static function sjukdom_redusert_slaktevekt_kg()
    {
        return self::$sjukdom_redusert_slaktevekt_kg;
    }

    public static function sjukdom_name()
    {
        return self::$sjukdom_name;
    }

    //CASE 1
    public static function budsjett_cv()
    {
        return self::$budsjett_cv;
    }

    public static function budsjett_smolt_pris_nok_per_stk()
    {
        return self::$budsjett_smolt_pris_nok_per_stk;
    }

    public static function budsjett_utkast_percentange()
    {
        return self::$budsjett_utkast / 100;
    }

    public static function budsjett_omregningsfaktor_rund_slyd()
    {
        return self::$budsjett_omregningsfaktor_rund_slyd;
    }

    public static function budsjett_redusert_pris_prod_per_kg()
    {
        return self::$budsjett_redusert_pris_prod_per_kg;
    }

    public static function budsjett_slaktekost_per_kg_slyd()
    {
        return self::$budsjett_slaktekost_per_kg_slyd;
    }

    public static function budsjett_transport_slakt_kr_per_kg_rund()
    {
        return self::$budsjett_transport_slakt_kr_per_kg_rund;
    }


    public static function budsjett_kostnad_ddfisk_kr_per_kg()
    {
        return self::$budsjett_kostnad_ddfisk_kr_per_kg;
    }


    public static function budsjett_nedklassing_prod_percentage()
    {
        return self::$budsjett_nedklassing_prod_percentage / 100;
    }

    public static function budsjett_forpris_snitt_kr_kg()
    {
        return self::$budsjett_forpris_snitt_kr_kg;
    }

    public static function budsjett_bfcr()
    {
        return self::$budsjett_bfcr;
    }

    public static function budsjett_snittvekt_ddfisk_kg()
    {
        return self::$budsjett_snittvekt_ddfisk_kg;
    }

    public static function budsjett_ddelighet_budsjett_percentage()
    {
        return self::$budsjett_ddelighet_budsjett_percentage / 100;
    }


    public static function budsjett_slaktevekt_rund_kg()
    {
        return self::$budsjett_slaktevekt_rund_kg;
    }

    public static function budsjett_smoltvekt_gram()
    {
        return self::$budsjett_smoltvekt_gram / 1000;
    }

    public static function budsjett_simulering()
    {
        return self::$budsjett_simulering;
    }

    public static function prod_kost_budsjett()
    {
        return self::$prod_kost_budsjett;
    }


    public static function laksepris()
    {
        return self::$laksepris;
    }

    public static function antallSmolt()
    {
        return self::$antall_smolt;
    }


    public static function navn()
    {
        return self::$navn;
    }

    public static function generasjon()
    {
        return self::$generasjon;
    }

    public static function lokalitet()
    {
        return self::$lokalitet;
    }


    public static function caseNo()
    {
        return self::$case_no;
    }

    private static function taptSlaktevolumeHOGKg()
    {
        self::$solgtBiomasseTotHOGvalue[self::caseNo()] = EM::solgtBiomasseTotHOG();
        return self::caseNo() == 1 ? 0 : (self::$solgtBiomasseTotHOGvalue[1] - EM::solgtBiomasseTotHOG());
    }

    // Total variable kost % of Prodkost

    private static function totalVariableKost()
    {
        return (EM::variableKostnaderSumNOK1000() / EM::prodkostTotalNOK1000()) * 100;
    }

    // grossProfitMargin

    public static function grossProfitMargin()
    {
        return (EM::resultatNOK1000() / EM::salgsinntekterNOK1000()) * 100;
    }

    //.........Pdf output end......


    public static function output(ToolsOutputInterface $toolsOutput)
    {
        $outputData = array(

            'graphs' => array(
                'slaktevektRund' => number_format(EM::slaktevektRundKg(), 2),
                'tonnSloyd' => number_format((EM::solgtBiomasseTotHOG() / 1000), 1),
                'efcr' => number_format(EM::eFCR(), 2),
                'prodkostPerKg' => number_format(EM::prodkostPerKgHOG(), 2),
                'driftsResultat' => number_format(EM::resultatNOK1000(), 0),
                'nytteKostRatio1' => number_format(EM::nytteKostRatio(), 1),
                'nytteKostRatio2' => number_format(EM::nytteKostRatio2(), 1),
                'biologiskeTap' => number_format(EM::biologiskeTapNOK1000(), 1),
                'okteUtgifter' => number_format(EM::okteUtgifterNOK1000(), 1),
                'lakseprisGjennomsnittKrPerkg' => number_format(EM::lakseprisGjennomsnittKrPerKg(), 2),
                'deadPercentage' => number_format(BPLM::deadPercentage() * 100, 1),
                'grossProfitMargin' => number_format(self::grossProfitMargin(), 2),
            ),

            'pdf' => array(
                'totalProdKostCase1' => number_format((EM::prodkostTotalNOK1000()), 2, '.', ' '),
                'totalVariableKost' => number_format((self::totalVariableKost()), 2, '.', ' '),
                'lakseprisPerKg' => EM::lakseprisGjennomsnittKrPerKg(),
                'driftsResultat' => number_format(EM::resultatNOK1000(), 1, '.', ' '),
                'slaktevektHOGkg' => number_format(EM::slaktevektHOGKg(), 2, '.', ' '),
                'deadPercentage' => number_format(BPLM::deadPercentage() * 100, 1, '.', ' '),
                'slaktevektRundvektKg' => number_format(EM::slaktevektRundKg(), 2, '.', ' '),
                'slaktetAntall' => number_format(round(BPLM::antallSlaktet()), 0, '.', ' '),
                'slaktevolumHOGKg' => number_format(round(EM::solgtBiomasseTotHOG()), 0, '.', ' '),
                'salgsverdiNOK1000' => number_format(round(EM::salgsinntekterNOK1000()), 0, '.', ' '),
                'prodkostKrPerKg' => number_format(EM::prodkostPerKgHOG(), 2, '.', ' '),
                'biomasseDeadfiskKg' => number_format(EM::deadBiomasse(), 0, '.', ' '),
                'efcr' => number_format(EM::eFCR(), 2),
                'kostnadVedSjukdom' => number_format(EM::costOfDiseaseNOK1000(), 1, '.', ' '),
                'okteUtgifterNOK1000' => number_format(EM::okteUtgifterNOK1000(), 1, '.', ' '),
                'biologiskeTapNOK1000' => number_format(EM::biologiskeTapNOK1000(), 1, '.', ' '),
                'taptSlaktevolumeHOGKg' => number_format(self::taptSlaktevolumeHOGKg(), 0, '.', ' '),
                'lakseprisGjennomsnittKrPerkg' => number_format(EM::lakseprisGjennomsnittKrPerKg(), 2),
                'nytteKostRatio1' => number_format(EM::nytteKostRatio(), 2),
                'nytteKostRatio2' => number_format(EM::nytteKostRatio2(), 2),
                'grossProfitMargin' => number_format(self::grossProfitMargin(), 2),
            ),
            'price_module' => array(
                'snittvekt' => number_format(BPLM::slaktevektHOGKg(), 2, '.', ' '),
                'cv' => number_format(BPLM::cv(), 1, '.', ' '),
            )
        );

        $outputData = $toolsOutput->formatOutput($outputData);

        return $outputData;
    }
}
