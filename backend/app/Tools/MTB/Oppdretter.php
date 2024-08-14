<?php

namespace App\Tools\MTB;

use App\Modules\PrisModule;
use App\Tools\ToolsOutputInterface;

class Oppdretter
{
    public static $case_no;

    public static $mtb_selskap_mtb_per_kons;
    public static $mtb_selskap_antall_konsesjoner;
    public static $mtb_selskap_faste_kost_nok_mill_per_kons;
    public static $mtb_selskap_konvetrering_rund_til_hog;

    public static $mtb_produksjon_mtb_utnytting;
    public static $mtb_produksjon_snitttemp;
    public static $mtb_produksjon_smoltvekt_gram;
    public static $mtb_produksjon_slaktevekt_rund_gram;

    public static $mtb_biologi_svinn_maned;
    public static $mtb_biologi_fcrb;
    public static $mtb_biologi_vf3;
    public static $mtb_biologi_cv;

    public static $mtb_kvalitet_prod_kvalitet;
    public static $mtb_kvalitet_utkast;

    public static $mtb_priser_forpris;
    public static $mtb_priser_smoltpris_per_fisk;
    public static $mtb_priser_smoltpris_per_kg;
    public static $mtb_priser_innkjring_og_slakt_per_kg_hog;
    public static $mtb_priser_ddfisk_per_kg;
    public static $mtb_priser_snittvekt_ddfisk_av_snittvekt;
    public static $mtb_priser_prod_kvalitet_redusert_pris_per_kg;
    public static $mtb_priser_laksepris;
    public static $mtb_priser_variabel_drifstkost_per_kons_dag_nok;

    public static $mtb_investering_investeringskost_nok_1000;
    public static $mtb_investering_avskrivingstid;
    public static $mtb_investering_restverdi;
    public static $mtb_investering_rente;
    public static $mtb_investering_tiltak_nok_1000_per_ar;
    public static $mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar;
    public static $mtb_investering_merpris_for_nok_kg;


    private static $solgtVolumSloydTValue;
    private static $forprisInputValue;

    private static $sumTiltakMil = [];

    public static function setInputs(
        $case_no = 1,

        $mtb_selskap_mtb_per_kons = 780,
        $mtb_selskap_antall_konsesjoner = 57,
        $mtb_selskap_faste_kost_nok_mill_per_kons = 16,
        $mtb_selskap_konvetrering_rund_til_hog = .86,

        $mtb_produksjon_mtb_utnytting = 97,
        $mtb_produksjon_snitttemp = 9.1,
        $mtb_produksjon_smoltvekt_gram = 150,
        $mtb_produksjon_slaktevekt_rund_gram = 5500,

        $mtb_biologi_svinn_maned = .30,
        $mtb_biologi_fcrb = 1.16,
        $mtb_biologi_vf3 = 2.80,
        $mtb_biologi_cv = 22,

        $mtb_kvalitet_prod_kvalitet = 3,
        $mtb_kvalitet_utkast = .5,

        $mtb_priser_forpris = 11.50,
        $mtb_priser_smoltpris_per_fisk = 5,
        $mtb_priser_smoltpris_per_kg = 75,
        $mtb_priser_innkjring_og_slakt_per_kg_hog = 3.5,
        $mtb_priser_ddfisk_per_kg = 2,
        $mtb_priser_snittvekt_ddfisk_av_snittvekt = 100,
        $mtb_priser_prod_kvalitet_redusert_pris_per_kg = -7,
        $mtb_priser_laksepris = 59.56,
        $mtb_priser_variabel_drifstkost_per_kons_dag_nok = 3000,

        $mtb_investering_investeringskost_nok_1000 = 55,
        $mtb_investering_avskrivingstid = 10,
        $mtb_investering_restverdi = 5,
        $mtb_investering_rente = 3.5,
        $mtb_investering_tiltak_nok_1000_per_ar = 0,
        $mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar = 0,
        $mtb_investering_merpris_for_nok_kg = 0
    )
    {
        self::$case_no = $case_no;

        self::$mtb_selskap_mtb_per_kons = $mtb_selskap_mtb_per_kons;
        self::$mtb_selskap_antall_konsesjoner = $mtb_selskap_antall_konsesjoner;
        self::$mtb_selskap_faste_kost_nok_mill_per_kons = $mtb_selskap_faste_kost_nok_mill_per_kons;
        self::$mtb_selskap_konvetrering_rund_til_hog = $mtb_selskap_konvetrering_rund_til_hog;

        self::$mtb_produksjon_mtb_utnytting = $mtb_produksjon_mtb_utnytting;
        self::$mtb_produksjon_snitttemp = $mtb_produksjon_snitttemp;
        self::$mtb_produksjon_smoltvekt_gram = $mtb_produksjon_smoltvekt_gram;
        self::$mtb_produksjon_slaktevekt_rund_gram = $mtb_produksjon_slaktevekt_rund_gram;

        self::$mtb_biologi_svinn_maned = $mtb_biologi_svinn_maned;
        self::$mtb_biologi_fcrb = $mtb_biologi_fcrb;
        self::$mtb_biologi_vf3 = $mtb_biologi_vf3;
        self::$mtb_biologi_cv = $mtb_biologi_cv;

        self::$mtb_kvalitet_prod_kvalitet = $mtb_kvalitet_prod_kvalitet;
        self::$mtb_kvalitet_utkast = $mtb_kvalitet_utkast;

        self::$mtb_priser_forpris = $mtb_priser_forpris;
        self::$mtb_priser_smoltpris_per_fisk = $mtb_priser_smoltpris_per_fisk;
        self::$mtb_priser_smoltpris_per_kg = $mtb_priser_smoltpris_per_kg;
        self::$mtb_priser_innkjring_og_slakt_per_kg_hog = $mtb_priser_innkjring_og_slakt_per_kg_hog;
        self::$mtb_priser_ddfisk_per_kg = $mtb_priser_ddfisk_per_kg;
        self::$mtb_priser_snittvekt_ddfisk_av_snittvekt = $mtb_priser_snittvekt_ddfisk_av_snittvekt;
        self::$mtb_priser_prod_kvalitet_redusert_pris_per_kg = $mtb_priser_prod_kvalitet_redusert_pris_per_kg;
        self::$mtb_priser_laksepris = $mtb_priser_laksepris;
        self::$mtb_priser_variabel_drifstkost_per_kons_dag_nok = $mtb_priser_variabel_drifstkost_per_kons_dag_nok;

        self::$mtb_investering_investeringskost_nok_1000 = $mtb_investering_investeringskost_nok_1000;
        self::$mtb_investering_avskrivingstid = $mtb_investering_avskrivingstid;
        self::$mtb_investering_restverdi = $mtb_investering_restverdi;
        self::$mtb_investering_rente = $mtb_investering_rente;
        self::$mtb_investering_tiltak_nok_1000_per_ar = $mtb_investering_tiltak_nok_1000_per_ar;
        self::$mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar = $mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar;
        self::$mtb_investering_merpris_for_nok_kg = $mtb_investering_merpris_for_nok_kg;
    }

    public static function caseNo()
    {
        return self::$case_no;
    }

    public static function mtbPerKons()
    {
        return self::$mtb_selskap_mtb_per_kons;
    }

    public static function tonn()
    {
        return self::antallKonsesjoner() * self::mtbPerKons();
    }

    //.........Selskap block start......
    public static function antallKonsesjoner()
    {
        return self::$mtb_selskap_antall_konsesjoner;
    }

    public static function fasteKostNOKMillPerKons()
    {
        return self::$mtb_selskap_faste_kost_nok_mill_per_kons;
    }

    public static function konvetreringRundTilHOG()
    {
        return self::$mtb_selskap_konvetrering_rund_til_hog;
    }
    //.........Selskap block end......

    //.........Produksjon block start......
    public static function mtbUtnytting()
    {
        return self::$mtb_produksjon_mtb_utnytting;
    }

    public static function snitttemp()
    {
        return self::$mtb_produksjon_snitttemp;
    }

    public static function smoltvektGram()
    {
        return self::$mtb_produksjon_smoltvekt_gram;
    }

    public static function slaktevektRundGram()
    {
        return self::$mtb_produksjon_slaktevekt_rund_gram;
    }
    //.........Produksjon block end......


    //.........Biologi block start......
    public static function svinnManed()
    {
        return self::$mtb_biologi_svinn_maned;
    }

    public static function fcrb()
    {
        return self::$mtb_biologi_fcrb;
    }

    public static function vf3()
    {
        return self::$mtb_biologi_vf3;
    }
    //.........Biologi block end......

    //.........Kvalitet block start......
    public static function prodKvalitet()
    {
        return self::$mtb_kvalitet_prod_kvalitet;
    }

    public static function utkast()
    {
        return self::$mtb_kvalitet_utkast;
    }
    //.........Kvalitet block end......

    //.........Priser block start......
    public static function forprisInput()
    {
        return self::$mtb_priser_forpris;
    }

    public static function forpris()
    {
        $case_no = Oppdretter::caseNo();
        self::$forprisInputValue[$case_no] = self::forprisInput();

        //if ($case_no > 1) {
        //    return self::$forprisInputValue[1];
        //}

        return self::$forprisInputValue[1];
    }

    public static function forprisNokPerKg()
    {
        $case_no = Oppdretter::caseNo();
        self::$forprisInputValue[$case_no] = self::forprisInput();
        if ($case_no > 1) {
            return self::$forprisInputValue[1] + Investering::merprisForNokKg();
        }

        return self::forprisInput();
    }

    public static function smoltprisPerFisk()
    {
        return self::$mtb_priser_smoltpris_per_fisk;
    }

    public static function smoltprisPerKg()
    {
        return self::$mtb_priser_smoltpris_per_kg;
    }

    public static function innkjoringOgSlaktPerKgHOG()
    {
        return self::$mtb_priser_innkjring_og_slakt_per_kg_hog;
    }

    public static function dodfiskPerKg()
    {
        return self::$mtb_priser_ddfisk_per_kg;
    }

    public static function snittvektDodfiskAvSnittvekt()
    {
        return self::$mtb_priser_snittvekt_ddfisk_av_snittvekt;
    }

    public static function prodkvalitetRedusertPrisPerKg()
    {
        return self::$mtb_priser_prod_kvalitet_redusert_pris_per_kg;
    }

    public static function laksepris()
    {
        return self::$mtb_priser_laksepris;
    }

    public static function variabelDrifstkostPerKonsOrDagNOK()
    {
        return self::$mtb_priser_variabel_drifstkost_per_kons_dag_nok;
    }

    //.........Priser block end......


    //.........Investering block start......

    public static function investeringskostNOK1000()
    {
        return self::$mtb_investering_investeringskost_nok_1000;
    }

    public static function avskrivingstid()
    {
        return self::$mtb_investering_avskrivingstid;
    }

    public static function restverdi()
    {
        return self::$mtb_investering_restverdi / 100;
    }

    public static function rente()
    {
        return self::$mtb_investering_rente / 100; // percentage input
    }

    public static function tiltakNOK1000PerAr()
    {
        return self::$mtb_investering_tiltak_nok_1000_per_ar;
    }

    public static function ekstraordinreKostnaderNOK1000PerAr()
    {
        return self::$mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar;
    }

    public static function merprisForNokKg()
    {
        return self::$mtb_investering_merpris_for_nok_kg;
    }

    public static function cv()
    {
        return self::$mtb_biologi_cv;
    }


    //.........Investering block end......


    //.........Graph output start......
    public static function tonnPerKonsPerAr()
    {
        return EM3::tonnPerKonsesjonPerAr();
    }

    public static function tonnSolgtPerSelskapPerAr()
    {
        return EM3::solgtVolumSloydT();
    }

    public static function resultatIMill()
    {
        return EM3::resultat() / 100;
    }

    public static function resultatIMillOutput()
    {
        return EM3::resultat() / 1000;
    }

    public static function eFCR()
    {
        return EM3::eFCR();
    }

    public static function prodkost()
    {
        return EM3::prodkostPerKgHOG();
    }

    public static function lakseprisGjennomsnittKrOrKg()
    {
        return EM3::lakseprisGjennomsnittKrOrKg();
    }

    public static function marginKrOrKgHOG()
    {
        return EM3::marginPerKg();
    }



    //.........Graph output end......

    //.........Block output start......
    public static function kostTiltakMil()
    {
        $case_no = Oppdretter::caseNo();
        if ($case_no > 1) {
            return EM3::prodkostPerKgHOG() + ((self::totalKostTiltakMil() * 1000) / EM3::solgtVolumSloydT());
        }
        return 0;
    }

    public static function totalKostTiltakMil()
    {
        self::$sumTiltakMil[self::$case_no] = EM3::sumKostnaderTiltakNOK1000() / 1000;
        return array_sum(self::$sumTiltakMil);
    }

    public static function totalNytteOrkostRatio()
    {
        //return EM3::nytteKostRatio();
    }

    //.........Block output end......

    //.........Pdf output start......
    public static function ktProduksjonPerR()
    {
        $case_no = Oppdretter::caseNo();
        self::$solgtVolumSloydTValue[$case_no] = EM3::solgtVolumSloydT();

        if ($case_no > 1) {
            $match = self::$solgtVolumSloydTValue[1] == 0 ? 0 : ((EM3::solgtVolumSloydT() - self::$solgtVolumSloydTValue[1]) / self::$solgtVolumSloydTValue[1]);
            return $match * 100;
        }

        return 0;
    }

    // grossProfitMargin

    public static function grossProfitMargin()
    {
        return (EM3::resultat() / EM3::salgsinntekterNOK1000()) * 100;
    }

    //.........Pdf output end......


    public static function calculateOutput(ToolsOutputInterface $toolsOutput)
    {
        $outputData = array(
            'graphs' => array(
                'tonnPerKonsPerAr' => number_format(self::tonnPerKonsPerAr(), 2),
                'tonnSolgtPerSelskapPerAr' => number_format(self::tonnSolgtPerSelskapPerAr(), 2),
                'resultatIMill' => number_format(self::resultatIMillOutput(), 2),
                'eFcr' => number_format(self::eFCR(), 2),
                'prodKost' => number_format(self::prodkost(), 2),
                'lakseprisSnittKrPerKg' => number_format(self::lakseprisGjennomsnittKrOrKg(), 2),
                'marginKrPerKgHOG' => number_format(self::marginKrOrKgHOG(), 2),
                'sgr' => number_format(MtbModul::sgr(), 2),
                'dagerISjo' => number_format(EM3::snittProduksjonstidDag(), 2),
                'snittvektSloyd' => number_format(EM3::snittvektSloyd(), 2),
                'dodeAntall' => number_format(EM3::dodeAntall1000(), 2),
                'dodeTonn' => number_format(MtbModul::dodeTonn(), 2),
                'dodePerGen' => number_format(EM3::dodeAkkPerGenerasjon(), 2),
                'smoltVektKg' => number_format(EM3::smoltvektKg(), 2),
                'smoltPerKonsPerAr' => number_format(EM3::smoltPerKons1000(), 2),
                'grossProfitMargin' => number_format(self::grossProfitMargin(), 2),
                'nytteKostRatio1' => number_format(self::totalNytteOrkostRatio(), 1),
                'nytteKostRatio2' => number_format(EM3::nytteKostRatio2(), 1)
            ),
            'blocks' => array(
                'tonn' => self::tonnSolgtPerSelskapPerAr(),
                'prodkost' => EM3::prodkostPerKgHOG(),
                'margin' => EM3::marginPerKg(),
                'resultatIMill' => self::resultatIMillOutput(),
                'kostTiltakMil' => EM3::sumKostnaderTiltakNOK1000() / 1000,
                'sumKostnaderNOK1000' => EM3::sumKostnaderNOK1000(),
//                'nytteKostRatio1' => EM3::nytteKostRatio(),
                'nytteKostRatio2' => EM3::nytteKostRatio2(),
                'totalNytteOrkostRatio' => self::totalNytteOrkostRatio(),
                'totalKostTiltakMil' => self::totalKostTiltakMil(),
                'grossProfitMargin' => number_format(self::grossProfitMargin(), 2)
            ),
            'pdf' => array(
                'antallKons' => EM3::antallKons(),
                'tilgjengeligMTBTonn' => number_format(self::tonn(), 0, '.', ' '),
                'mtbUtnytting' => round(self::mtbUtnytting()),
                'snitttemp' => number_format(self::snitttemp(), 1, '.', ' '),
                'smoltvektGram' => round(self::smoltvektGram()),
                //'slaktevektRundKg' => round(self::slaktevektRundGram()),
                'slaktevektRundKg' => self::slaktevektRundGram() / 1000,
                'vf3' => number_format(self::vf3(), 2, '.', ' '),
                'bfcr' => number_format(self::fcrb(), 2, '.', ' '),
                'svinnBiomassePerMnd' => number_format(self::svinnManed(), 2, '.', ' '),
                'nedklassingProdBiomasse' => number_format(self::prodKvalitet(), 1, '.', ' '),
                'utkastBiomasse' => number_format(self::utkast(), 1, '.', ' '),
                'smoltPrisNOKPerStk' => number_format(EM3::smoltPrisNOKPerStk(), 2, '.', ' '),
                'forprisNokPerKg' => number_format(self::forprisNokPerKg(), 2, '.', ' '),
                'dodfiskNokPerKg' => self::dodfiskPerKg(),
                'innkjoringOgSlaktPerKgHOG' => number_format(EM3::innkjoringOgSlaktPerKgHOG(), 2, '.', ' '),
                'prodkvalitetRedusertPrisPerKg' => number_format(self::prodkvalitetRedusertPrisPerKg(), 2, '.', ' '),
                'laksepris' => number_format(self::laksepris(), 2, '.', ' '),

                'tonnPerKonsPerAr' => number_format(round(EM3::solgtVolumPerKonsT()), 0, '.', ' '),
                'tonnPerSelsKapHOG' => number_format(round(EM3::solgtVolumSloydT()), 0, '.', ' '),
                'oktProduksjonPerAr' => number_format(self::ktProduksjonPerR(), 1, '.', ' '),
                'produsertSjoTonn' => number_format(round(MtbModul::hogT()), 0, '.', ' '),
                'salgsinntekterNOK1000' => number_format(round(EM3::salgsinntekterNOK1000() / 1000), 0, '.', ' '),
                'sumKostnaderNOK1000' => number_format(round(EM3::sumKostnaderNOK1000() / 1000), 0, '.', ' '),
                'resultatNOK1000' => number_format(round(EM3::resultat() / 1000), 0, '.', ' '),
                //'oktResultatNOK1000' => number_format(EM3::forbedringResultat(), 2),
                'oktResultatNOK1000' => number_format(round(EM3::forbedringResultat()), 0, '.', ' '),
                'forbedringResultatPercentage' => number_format(EM3::forbedringResultatPercentage(), 1, '.', ' '),
                // 'nytteOrKostRatio' => number_format(EM3::nytteKostRatio(), 1, '.', ' '),
                // 'nytteKostRatio2' => number_format(EM3::nytteKostRatio2(), 1, '.', ' '),
                'nytteKostRatio2' => number_format(EM3::nytteKostRatio2(), 1, '.', ' '),
                'grossProfitMargin' => number_format(self::grossProfitMargin(), 2),
                'prodkostPerKgHOG' => number_format(EM3::prodkostPerKgHOG(), 2, '.', ' '),
                'snittLakseprisNokPerKgHog' => number_format(EM3::lakseprisGjennomsnittKrOrKg(), 2, '.', ' '),
                'smoltPerKonsPerAr1000' => round(EM3::smoltPerKons1000()),
                'smoltPerArSelskapMill' => number_format(EM3::smoltAntall1000() / 1000, 1, '.', ' '),
                'eFCR' => number_format(EM3::eFCR(), 2, '.', ' '),
                'dodfiskTonnPerAr' => number_format(round(EM3::dodfiskBiomasse()), 0, '.', ' '),
                'dodePerGen' => number_format(EM3::dodeAkkPerGenerasjon(), 1, '.', ' '),
                'dagerISjø' => round(EM3::snittProduksjonstidDag()),
                'reduserteDager' => round(EM3::reduserteDager()),
                'reduksjonRisikotid' => number_format(EM3::reduksjonRisikotid(), 1, '.', ' ')
            ),
            'investering' => array(
                'avskrivingPerAr' => Investering::avskrivingPerAr(),
                'restverdi' => Investering::restverdiNok1000(),
                'kapitalgrunnlag' => Investering::kapitalgrunnlag(),
                'rentePerAr' => Investering::rentePerAr(),
                'sumInvesteringPerAr' => Investering::sumInvesteringPerAr()
            ),
            'price_module' => array(
                'snittvekt' => number_format(EM3::snittvektSloyd(), 2),
                'cv' => self::cv()
            )
        );

        $outputData = $toolsOutput->formatOutput($outputData);

        return $outputData;
    }
}
