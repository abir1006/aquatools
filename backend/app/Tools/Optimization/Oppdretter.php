<?php

namespace App\Tools\Optimization;

use App\Tools\Modules\bPLM_EM\BPLM;
use App\Tools\Modules\bPLM_EM\EM;
use App\Tools\ToolsOutputInterface;

class Oppdretter
{
    public static $model = 'Optimization';
    public static $case_no;
    public static $lokalitet;
    public static $generasjon;
    public static $navn;
    public static $antall_smolt;
    public static $laksepris;
    public static $prod_kost;

    public static $simulering;
    public static $smoltvekt_gram;
    public static $vf3;
    public static $dgngrader;
    public static $ddelighet;
    public static $snittvekt_ddfisk_kg;
    public static $bfcr;
    public static $smolt_pris_nok_per_stk;
    public static $forpris_snitt_krkg;
    public static $nedklassing_prod;
    public static $transport_slakt_kr_per_kg_rund;
    public static $slaktekost_per_kg_slyd;
    public static $redusert_pris_prod_per_kg;
    public static $omregningsfaktor_rund_slyd;

    public static $kvalitet_ord;
    public static $kvalitet_prod;
    public static $kvalitet_utkast;

    public static $tiltak_investeringskost_nok_1000;
    public static $tiltak_avskrivingstid_ar;
    public static $tiltak_restverdi;
    public static $tiltak_rente;
    public static $tiltak_tiltak_nok_1000_per_ar;
    public static $tiltak_ekstraordinre_kostnader_nok_1000_per_ar;

    public static $basic_cv;
    public static $improved_cv;

    public static $values = [];

    private static $oktSlaktevektGramValue = [];
    private static $redusertDodelighetPercentage = [];
    private static $snittvektDeadfiskKg = [];
    private static $redusertBFCRPercentage = [];
    private static $reduksjonNedklassingProdPercentage = [];
    private static $reduksjonUtkastPercentage = [];
    private static $solgtBiomasseTotHOGValue = [];
    private static $resultatNOK1000Value = [];

    public static function setInputs(
        $case_no = 1,
        $lokalitet,
        $generasjon,
        $navn,
        $antall_smolt,
        $laksepris,
        $prod_kost,
        $simulering,
        $smoltvekt_gram,
        $vf3,
        $dgngrader,
        $ddelighet,
        $snittvekt_ddfisk_kg,
        $bfcr,
        $smolt_pris_nok_per_stk,
        $forpris_snitt_krkg,
        $nedklassing_prod,
        $transport_slakt_kr_per_kg_rund,
        $slaktekost_per_kg_slyd,
        $redusert_pris_prod_per_kg,
        $omregningsfaktor_rund_slyd,
        $kvalitet_ord,
        $kvalitet_prod,
        $kvalitet_utkast,
        $tiltak_investeringskost_nok_1000,
        $tiltak_avskrivingstid_ar,
        $tiltak_restverdi,
        $tiltak_rente,
        $tiltak_tiltak_nok_1000_per_ar,
        $tiltak_ekstraordinre_kostnader_nok_1000_per_ar,
        $basic_cv = 22,
        $improved_cv = 0
    ) {
        // logger(self::caseNo());
        // logger(get_defined_vars());
        self::$case_no = $case_no;
        self::$lokalitet = $lokalitet;
        self::$generasjon = $generasjon;
        self::$navn = $navn;
        self::$antall_smolt = $antall_smolt;
        self::$laksepris = $laksepris;
        self::$prod_kost = $prod_kost;
        self::$simulering = $simulering;
        self::$smoltvekt_gram = $smoltvekt_gram;
        self::$vf3 = $vf3;
        self::$dgngrader = $dgngrader;
        self::$ddelighet = $ddelighet;
        self::$snittvekt_ddfisk_kg = $snittvekt_ddfisk_kg;
        self::$bfcr = $bfcr;
        self::$smolt_pris_nok_per_stk = $smolt_pris_nok_per_stk;
        self::$forpris_snitt_krkg = $forpris_snitt_krkg;
        self::$nedklassing_prod = $nedklassing_prod;
        self::$transport_slakt_kr_per_kg_rund = $transport_slakt_kr_per_kg_rund;
        self::$slaktekost_per_kg_slyd = $slaktekost_per_kg_slyd;
        self::$redusert_pris_prod_per_kg = $redusert_pris_prod_per_kg;
        self::$omregningsfaktor_rund_slyd = $omregningsfaktor_rund_slyd;
        self::$kvalitet_ord = $kvalitet_ord;
        self::$kvalitet_prod = $kvalitet_prod;
        self::$kvalitet_utkast = $kvalitet_utkast;
        self::$tiltak_investeringskost_nok_1000 = $tiltak_investeringskost_nok_1000;
        self::$tiltak_avskrivingstid_ar = $tiltak_avskrivingstid_ar;
        self::$tiltak_restverdi = $tiltak_restverdi;
        self::$tiltak_rente = $tiltak_rente;
        self::$tiltak_tiltak_nok_1000_per_ar = $tiltak_tiltak_nok_1000_per_ar;
        self::$tiltak_ekstraordinre_kostnader_nok_1000_per_ar = $tiltak_ekstraordinre_kostnader_nok_1000_per_ar;
    }


    // Output started

    private static function oktSlaktevektGram()
    {
        self::$oktSlaktevektGramValue[self::$case_no] = EM::snittvektRund();
        if (self::$case_no == 1) {
            return 0;
        }
        return EM::snittvektRund() - self::$oktSlaktevektGramValue[1];
    }

    private static function redusertDodelighetPercentage()
    {
        self::$redusertDodelighetPercentage[self::$case_no] = BPLM::deadPercentage();
        if (self::$case_no == 1) {
            return 0;
        }
        return (BPLM::deadPercentage() - self::$redusertDodelighetPercentage[1]) * 100;
    }

    private static function snittvektDeadfiskKg()
    {
        self::$snittvektDeadfiskKg[self::$case_no] = BPLM::deadVektKg();
        if (self::$case_no == 1) {
            return 0;
        }
        return BPLM::deadVektKg() - self::$snittvektDeadfiskKg[1];
    }

    private static function redusertBFCRPercentage()
    {
        self::$redusertBFCRPercentage[self::$case_no] = EM::eFCR();
        if (self::$case_no == 1) {
            return 0;
        }
        return EM::eFCR() - self::$redusertBFCRPercentage[1];
    }

    private static function reduksjonNedklassingProdPercentage()
    {
        self::$reduksjonNedklassingProdPercentage[self::$case_no] = BPLM::prodPercentage();
        if (self::$case_no == 1) {
            return 0;
        }
        return (BPLM::prodPercentage() - self::$reduksjonNedklassingProdPercentage[1]) * 100;
    }

    private static function reduksjonUtkastPercentage()
    {
        self::$reduksjonUtkastPercentage[self::$case_no] = BPLM::utkastPercentage();
        if (self::$case_no == 1) {
            return 0;
        }
        return (BPLM::utkastPercentage() - self::$reduksjonUtkastPercentage[1]) * 100;
    }


    private static function merkostTiltakKrKg()
    {
        return EM::solgtBiomasseTotHOG() == 0 ? 0 : (EM::sumKostnaderTiltakNOK1000() * 1000 / EM::solgtBiomasseTotHOG(
            ));
    }

    private static function merslaktKg()
    {
        self::$solgtBiomasseTotHOGValue[self::$case_no] = EM::solgtBiomasseTotHOG();
        if (self::$case_no == 1) {
            return 0;
        }
        return EM::solgtBiomasseTotHOG() - self::$solgtBiomasseTotHOGValue[1];
    }

    private static function oktResultatNOK1000()
    {
        self::$resultatNOK1000Value[self::$case_no] = EM::resultatNOK1000();

        if (self::$case_no == 1) {
            return 0;
        }

        return EM::resultatNOK1000() - self::$resultatNOK1000Value[1];
    }

    private static function totalVariableKost()
    {
        return (EM::variableKostnaderSumNOK1000() / EM::prodkostTotalNOK1000()) * 100;
    }

    // grossProfitMargin

    public static function grossProfitMargin()
    {
        return (EM::resultatNOK1000() / EM::salgsinntekterNOK1000()) * 100;
    }


    public static function output(ToolsOutputInterface $toolsOutput)
    {
        $outputData = array(
            'graphs' => array(
                'slaktevektRundKg' => number_format(EM::slaktevektRundKg(), 2),
                'slaktevolumHOGTonn' => number_format((EM::solgtBiomasseTotHOG() / 1000), 2),
                'efcr' => number_format(EM::eFCR(), 2),
                'prodkostPerKg' => number_format(EM::prodkostPerKgHOG(), 2),
                'driftsResultatNOK1000' => number_format(EM::resultatNOK1000(), 2),
                'LakseprisNOKPerKg' => number_format(EM::lakseprisGjennomsnittKrPerKg(), 2),
                'nytteKostRatio1' => number_format(EM::nytteKostRatio(), 1),
                'nytteKostRatio2' => number_format(EM::nytteKostRatio2(), 1),
                'grossProfitMargin' => number_format(self::grossProfitMargin(), 2),
            ),

            'pdf' => array(
                'totalProdKostCase1' => number_format((EM::prodkostTotalNOK1000()), 2, '.', ' '),
                'totalVariableKost' => number_format((self::totalVariableKost()), 2, '.', ' '),
                'slaktevektHOGkg' => number_format((EM::slaktevektHOGKg()), 2, '.', ' '),
                'oktSlaktevektGram' => number_format((self::oktSlaktevektGram()), 2, '.', ' '),
                'redusertDodelighetPercentage' => number_format((self::redusertDodelighetPercentage()), 2, '.', ' '),
                'snittvektDeadfiskKg' => number_format((self::snittvektDeadfiskKg()), 2, '.', ' '),
                'redusertBFCRPercentage' => number_format((BPLM::bFcr()), 2, '.', ' '),
                'reduksjonNedklassingProdPercentage' => number_format(
                    (self::reduksjonNedklassingProdPercentage()),
                    2,
                    '.',
                    ' '
                ),
                'reduksjonUtkastPercentage' => number_format((self::reduksjonUtkastPercentage()), 2, '.', ' '),
                'slaktevolumHGkg' => number_format((EM::solgtBiomasseTotHOG()), 2, '.', ' '),
                'lakseprisNOKPerKg' => number_format((EM::lakseprisGjennomsnittKrPerKg()), 2, '.', ' '),
                'salgsverdiNOK1000' => number_format((EM::salgsinntekterNOK1000()), 2, '.', ' '),
                'prodkostKrPerkg' => number_format((EM::prodkostPerKgHOG()), 2, '.', ' '),

                'smoltCostPerKgHOG' => number_format((EM::smoltCostPerKgHOG()), 2, '.', ' '),
                'feedCostPerKgHOG' => number_format((EM::feedCostPerKgHOG()), 2, '.', ' '),

                'driftsResultatNOK1000' => number_format((EM::resultatNOK1000()), 2, '.', ' '),
                'dodelighetPercentage' => number_format((BPLM::deadPercentage() * 100), 2, '.', ' '),
                'biomasseDodfiskKg' => number_format((EM::deadBiomasse()), 2, '.', ' '),
                'efcr' => number_format((EM::eFCR()), 2, '.', ' '),
                'merkostnadTiltakProduksjonNOK1000' => number_format((EM::sumKostnaderTiltakNOK1000()), 2, '.', ' '),
                'merkostTiltakKrKg' => number_format((self::merkostTiltakKrKg()), 2, '.', ' '),
                'merslaktKg' => number_format((self::merslaktKg()), 2, '.', ' '),
                'oktResultatNOK1000' => number_format((self::oktResultatNOK1000()), 2, '.', ' '),
                'nytteKostRatio1' => number_format((EM::nytteKostRatio()), 2, '.', ' '),
                'nytteKostRatio2' => number_format((EM::nytteKostRatio2()), 2, '.', ' '),
                'grossProfitMargin' => number_format(self::grossProfitMargin(), 2),
            ),

            'price_module' => array(
                'snittvekt' => number_format(BPLM::slaktevektHOGKg(), 2, '.', ' '),
                'cv' => number_format(BPLM::cv(), 1, '.', ' ')
            )
        );

        $outputData = $toolsOutput->formatOutput($outputData);

        return $outputData;
    }


    /**
     * Get the value of case_no
     */
    public static function caseNo()
    {
        logger(self::$case_no);
        return self::$case_no;
    }

    /**
     * Get the value of lokalitet
     */
    public static function getLokalitet()
    {
        return self::$lokalitet;
    }

    /**
     * Get the value of generasjon
     */
    public static function getGenerasjon()
    {
        return self::$generasjon;
    }

    /**
     * Get the value of navn
     */
    public static function getNavn()
    {
        return self::$navn;
    }

    /**
     * Get the value of antall_smolt
     */
    public static function getAntallSmolt()
    {
        return self::$antall_smolt;
    }

    /**
     * Get the value of laksepris
     */
    public static function getLaksepris()
    {
        return self::$laksepris;
    }

    /**
     * Get the value of prod_kost
     */
    public static function getProdKost()
    {
        return self::$prod_kost;
    }

    /**
     * Get the value of simulering
     */
    public static function getSimulering()
    {
        return self::$simulering;
    }

    /**
     * Get the value of smoltvekt_gram
     */
    public static function getSmoltvektGram()
    {
        return self::$smoltvekt_gram;
    }

    /**
     * Get the value of vf3
     */
    public static function getVf3()
    {
        return self::$vf3;
    }

    /**
     * Get the value of dgngrader
     */
    public static function getDgngrader()
    {
        return self::$dgngrader;
    }

    /**
     * Get the value of ddelighet
     */
    public static function getDdelighet()
    {
        return self::$ddelighet / 100;
    }

    /**
     * Get the value of snittvekt_ddfisk_kg
     */
    public static function getSnittvektDdfiskKg()
    {
        return self::$snittvekt_ddfisk_kg;
    }

    /**
     * Get the value of bfcr
     */
    public static function getBfcr()
    {
        return self::$bfcr;
    }

    /**
     * Get the value of smolt_pris_nok_per_stk
     */
    public static function getSmoltPrisNokPerStk()
    {
        return self::$smolt_pris_nok_per_stk;
    }

    /**
     * Get the value of forpris_snitt_krkg
     */
    public static function getForprisSnittKrkg()
    {
        return self::$forpris_snitt_krkg;
    }

    /**
     * Get the value of nedklassing_prod
     */
    public static function getNedklassingProd()
    {
        return self::$nedklassing_prod / 100;
    }

    /**
     * Get the value of transport_slakt_kr_per_kg_rund
     */
    public static function getTransportSlaktKrPerKgRund()
    {
        return self::$transport_slakt_kr_per_kg_rund;
    }

    /**
     * Get the value of slaktekost_per_kg_slyd
     */
    public static function getSlaktekostPerKgSlyd()
    {
        return self::$slaktekost_per_kg_slyd;
    }

    /**
     * Get the value of redusert_pris_prod_per_kg
     */
    public static function getRedusertPrisProdPerKg()
    {
        return self::$redusert_pris_prod_per_kg;
    }

    /**
     * Get the value of omregningsfaktor_rund_slyd
     */
    public static function getOmregningsfaktorRundSlyd()
    {
        return self::$omregningsfaktor_rund_slyd;
    }

    /**
     * Get the value of kvalitet_ord
     */
    public static function getKvalitetOrd()
    {
        return self::$kvalitet_ord;
    }

    /**
     * Get the value of kvalitet_prod
     */
    public static function getKvalitetProd()
    {
        return self::$kvalitet_prod;
    }

    /**
     * Get the value of kvalitet_utkast
     */
    public static function getKvalitetUtkast()
    {
        return self::$kvalitet_utkast;
    }

    /**
     * Get the value of tiltak_investeringskost_nok_1000
     */
    public static function getTiltakInvesteringskostNok1000()
    {
        return self::$tiltak_investeringskost_nok_1000;
    }

    /**
     * Get the value of tiltak_avskrivingstid_ar
     */
    public static function getTiltakAvskrivingstidAr()
    {
        return self::$tiltak_avskrivingstid_ar;
    }

    /**
     * Get the value of tiltak_restverdi
     */
    public static function getTiltakRestverdi()
    {
        return self::$tiltak_restverdi;
    }

    /**
     * Get the value of tiltak_rente
     */
    public static function getTiltakRente()
    {
        return self::$tiltak_rente;
    }

    /**
     * Get the value of tiltak_tiltak_nok_1000_per_ar
     */
    public static function getTiltakTiltakNok1000PerAr()
    {
        return self::$tiltak_tiltak_nok_1000_per_ar;
    }

    /**
     * Get the value of tiltak_ekstraordinre_kostnader_nok_1000_per_ar
     */
    public static function getTiltakEkstraordinreKostnaderNok1000PerAr()
    {
        return self::$tiltak_ekstraordinre_kostnader_nok_1000_per_ar;
    }
}
