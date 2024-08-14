<?php

namespace App\Tools\Modules\bPLM_EM;

use App\Tools\Genetics\Oppdretter;
use phpDocumentor\Reflection\Types\Self_;

class EM
{
    private static $forpris;
    private static $smolt_pris_NOK_per_stk;
    private static $slaktevekt_rund_kg;
    private static $dead_fisk_per_kg;
    private static $innkjoring_per_kg_rundvekt;
    private static $slaktekostnader_per_kg_HOG;
    private static $lakse_pris;
    private static $redusert_pris_ord;
    private static $redusert_pris_prod;
    private static $prodkost_per_kg_HOG;
    private static $caseNo;
    private static $model_name;
    private static $forkost;
    private static $prodkost_per_kg_HOG_value = [];
    private static $resultatNOK1000Value = [];
    private static $sumKostnaderTiltakNOK1000Value = [];
    private static $solgtBiomasseTotHOGValue = [];
    public static $forkostValue = [];
    public static $fasteKostnaderPerArNOK1000Value = [];
    private static $deadfiskEnsilasjeNOK1000Value = [];
    private static $salgsinntekterNOK1000Value = [];
    private static $sumKostnaderNOK1000Value = [];
    private static $solgt_biomasse_tot_HOG = [];

    public static function setInputs(
        $caseNo = 1,
        $forpris = 0,
        $smolt_pris_NOK_per_stk = 0,
        $slaktevekt_rund_kg = 0,
        $dead_fisk_per_kg = 0,
        $innkjoring_per_kg_rundvekt = 0,
        $slaktekostnader_per_kg_HOG = 0,
        $lakse_pris = 0,
        $redusert_pris_ord = 0,
        $redusert_pris_prod = 0,
        $prodkost_per_kg_HOG = 0,
        $forkost = 0,
        $model_name = ''
    )
    {
        self::$caseNo = $caseNo;
        self::$model_name = $model_name;
        self::$forpris = $forpris;
        self::$smolt_pris_NOK_per_stk = $smolt_pris_NOK_per_stk;
        self::$slaktevekt_rund_kg = $slaktevekt_rund_kg;
        self::$dead_fisk_per_kg = $dead_fisk_per_kg;
        self::$innkjoring_per_kg_rundvekt = $innkjoring_per_kg_rundvekt;
        self::$slaktekostnader_per_kg_HOG = $slaktekostnader_per_kg_HOG;
        self::$lakse_pris = $lakse_pris;
        self::$redusert_pris_ord = $redusert_pris_ord;
        self::$redusert_pris_prod = $redusert_pris_prod;
        self::$prodkost_per_kg_HOG_value[$caseNo] = $prodkost_per_kg_HOG;
        self::$forkost = $forkost;
        self::$forkostValue[$caseNo] = $forkost;
    }

    private static function currentModel()
    {
        return self::$model_name;
    }

    // Cell D3
    public static function smoltAntall()
    {
        return BPLM::antallUtsatt();
    }

    // Cell D4
    public static function smoltPrisNOKPerStk()
    {
        // fetch from input
        return self::$smolt_pris_NOK_per_stk;
    }

    // Cell D5
    public static function smoltKostNOK1000()
    {
        return self::smoltAntall() * self::smoltPrisNOKPerStk() / 1000;
    }


    public static function smoltCostPerKgHOG()
    {
        return self::solgtBiomasseTotHOG() == 0 ? 0 : (self::smoltKostNOK1000() * 1000) / self::solgtBiomasseTotHOG();
    }

    public static function feedCostPerKgHOG()
    {
        return self::solgtBiomasseTotHOG() == 0 ? 0 : (self::innkjoptFeedNOK1000() * 1000) / self::solgtBiomasseTotHOG();
    }

    // Cell D6
    public static function smoltvektKg()
    {
        return BPLM::smoltvektKg();
    }

    // Cell D7
    public static function slaktevektRundKg()
    {
        // fetch from input
        return BPLM::slaktevektRundSup();
    }

    // Cell D8
    public static function innkjortBiomasseKg()
    {
        return BPLM::innkjortBiomasseRundKg();
    }

    // Cell D9
    public static function solgtBiomasseRundVekt()
    {
        return BPLM::solgtBiomasseRundVektKg();
    }

    // Cell D10
    public static function smoltBiomasse()
    {
        return BPLM::smoltBiomasseKg();
    }

    // Cell D11
    public static function deadBiomasse()
    {
        return BPLM::deadBiomasseKg();
    }

    // Cell D12
    public static function deadAntall()
    {
        return BPLM::deadAntall();
    }

    // Cell D13
    public static function utkastBiomasse()
    {
        return BPLM::utkastBiomasseKg();
    }

    // Cell D14
    public static function produsertBiomasse()
    {
        return BPLM::produsertBiomasseKg();
    }

    // Cell D15
    public static function feedVolumKg()
    {
        return BPLM::feedVolumKg();
    }

    // Cell D17
    public static function antallSlaktetSolgt()
    {
        return BPLM::sogtAntall();
    }

    // Cell D18
    public static function solgtBiomasseTotHOG()
    {
        self::$solgt_biomasse_tot_HOG[self::$caseNo] = BPLM::solgtBiomasseTotHOGKg();
        return BPLM::solgtBiomasseTotHOGKg();
    }

    // Cell D19
    public static function solgtBiomasseSup()
    {
        return BPLM::solgtBiomasseSupHOGKg();
    }

    // Cell D20
    public static function solgtBiomasseOrd()
    {
        return BPLM::solgtBiomasseOrdHOGKg();
    }

    // Cell D21
    public static function solgtBiomasseProd()
    {
        return BPLM::solgtBiomasseProdHOGKg();
    }

    // Cell D23
    public static function feedPris()
    {
        // fetch from input
        return self::$forpris;
    }

    // Cell D24
    // D15*D23/1000
    public static function innkjoptFeedNOK1000()
    {
        return self::feedVolumKg() * self::feedPris() / 1000;
    }

    // Cell D25
    // D11*$C$25/1000
    public static function deadfiskEnsilasjeNOK1000()
    {
        self::$deadfiskEnsilasjeNOK1000Value[self::$caseNo] = self::$dead_fisk_per_kg * self::deadBiomasse() / 1000;
        return self::$dead_fisk_per_kg * self::deadBiomasse() / 1000;
    }

    // Cell D26
    // Fetch from input
    public static function innkjoringPerKgRundvekt()
    {
        return self::$innkjoring_per_kg_rundvekt;
    }

    // Cell D27
    // Fetch from input
    public static function slaktekostnaderPerKgHOG()
    {
        return self::$slaktekostnader_per_kg_HOG;
    }

    // Cell D28
    // ((D8*D26)+(D18*D27))/1000
    public static function slakteKostnaderTotaletNOK1000()
    {
        return ((self::innkjortBiomasseKg() * self::innkjoringPerKgRundvekt()) + (self::solgtBiomasseTotHOG() * self::slaktekostnaderPerKgHOG())) / 1000;
    }

    // Cell D29
    public static function luseKostnader()
    {
        return 0;
    }

    // Cell D30
    public static function variableKostnaderSumNOK1000()
    {
        return self::smoltKostNOK1000() + self::innkjoptFeedNOK1000() + self::deadfiskEnsilasjeNOK1000() + self::slakteKostnaderTotaletNOK1000() + self::luseKostnader();
    }

    // Cell D31
    // (D30*1000)/D18
    public static function varibleKostnaderPerKg()
    {
        return self::solgtBiomasseTotHOG() == 0 ? 0 : (self::variableKostnaderSumNOK1000() * 1000) / self::solgtBiomasseTotHOG();
    }

    // Cell D32
    // Fetch from input
    public static function laksePris()
    {
        return self::$lakse_pris;
    }

    // Cell D33
    // Fetch from input
    public static function redusertPrisOrd()
    {
        return self::$redusert_pris_ord;
    }

    // Cell D34
    // Fetch from input
    public static function redusertPrisProd()
    {
        return self::$redusert_pris_prod;
    }

    // Cell D35
    // ((D19*D32)+(D20*(D32-D33))+(D21*(D32-D34)))/1000
    public static function salgsinntekterNOK1000()
    {
        return ((self::solgtBiomasseSup() * self::laksePris()) + (self::solgtBiomasseOrd() * (self::laksePris() - self::redusertPrisOrd())) + (self::solgtBiomasseProd() * (self::laksePris() - self::redusertPrisProd()))) / 1000;
    }

    // Cell D36
    public static function prodkostPerKgHOGCase1()
    {
        return self::$prodkost_per_kg_HOG_value[1];
    }

    // Cell D36
    public static function solgtBiomasseTotHOGCase1()
    {
        return self::$solgt_biomasse_tot_HOG[1];
    }

    // Cell D37
    // D36*D18/1000
    public static function prodkostTotalNOK1000()
    {
        return self::prodkostPerKgHOGCase1() * self::solgtBiomasseTotHOGCase1() / 1000;
    }

    // Cell D38
    // D37-D30
    public static function fasteKostnaderPerArNOK1000()
    {
        self::$fasteKostnaderPerArNOK1000Value[self::$caseNo] = self::prodkostTotalNOK1000() - self::variableKostnaderSumNOK1000();
        return self::$fasteKostnaderPerArNOK1000Value[1];
    }

    public static function ekstraordinareKostBehandlingForebyggingNOK1000()
    {
        return BPLM::ekstraordinreKostnaderNok1000() + BPLM::behandlingskostnadNok1000() + BPLM::forebygginskostnadNok1000();
    }

    // Kostnader tiltak started
    // Cell D40
    public static function ekstraKostnaderFeedNOK1000()
    {
        if (self::$caseNo == 1) {
            return 0;
        }

        return self::feedVolumKg() * TilTak::merprisFeedNOKPerKg() / 1000;
    }

    // Cell D41
    public static function ekstraKostnaderVaksinerNOK1000()
    {
        if (self::$caseNo <= 2) {
            return 0;
        }

        return TilTak::vaksineKost() / 1000;
    }

    // Cell D42
    public static function ekstraKostnaderGenetikkNOK1000()
    {
        if (self::$caseNo == 1) {
            return 0;
        }

        return self::smoltAntall() * Oppdretter::antallRognPerSmolt() * TilTak::merprisGenetikkPerEgg() / 1000;
    }

    // Cell D43
    public static function tiltakPerArNOK1000()
    {
        return TilTak::tiltakNOK1000PerAr();
    }

    // Cell D44
    public static function ekstraOrdinareKostnaderNOK1000PerAr()
    {
        return TilTak::ekstraOrdinareKostnaderNOK1000PerAr();
    }

    // Investeringer started
    // Cell D46
    public static function investeringAvskrivingNOK1000()
    {
        return TilTak::avskrivingPerAr();
    }

    // Cell D47
    public static function investeringRentekostNOK1000()
    {
        return TilTak::rentePerArNOK1000();
    }

    // Cell D48
    // Sum(D40 : D47)
    public static function sumKostnaderTiltakNOK1000()
    {
        return self::ekstraKostnaderFeedNOK1000() + self::ekstraKostnaderVaksinerNOK1000() + self::ekstraKostnaderGenetikkNOK1000() + self::tiltakPerArNOK1000() + self::ekstraOrdinareKostnaderNOK1000PerAr() + self::investeringAvskrivingNOK1000() + self::investeringRentekostNOK1000();
    }

    // Cell D49
    // D30+D38+D48+D39
    public static function sumKostnaderNOK1000()
    {
        return self::variableKostnaderSumNOK1000() + self::fasteKostnaderPerArNOK1000() + self::sumKostnaderTiltakNOK1000() + self::ekstraordinareKostBehandlingForebyggingNOK1000();
    }

    //
    // =D35-D30-D38-D48
    public static function resultatNOK1000()
    {
        return self::salgsinntekterNOK1000() - self::sumKostnaderNOK1000();
    }

    // Cell D51
    // D50/D35
    public static function driftsmargin()
    {
        return self::salgsinntekterNOK1000() == 0 ? 0 : self::resultatNOK1000() / self::salgsinntekterNOK1000();
    }

    // Cell D52
    public static function forbedringResultat()
    {
        self::$resultatNOK1000Value[self::$caseNo] = self::resultatNOK1000();

        if (self::$caseNo == 1) {
            return 0;
        }

        return self::resultatNOK1000() - self::$resultatNOK1000Value[1];
    }

    // Cell D53
    // (E50-D50)/(E48-D48)
    public static function nytteKostRatio()
    {
        $prevCaseIndex = strtolower(self::currentModel()) == 'vaccine' ? 2 : 1;
        self::$resultatNOK1000Value[self::$caseNo] = self::resultatNOK1000();
        self::$sumKostnaderTiltakNOK1000Value[self::$caseNo] = self::sumKostnaderTiltakNOK1000();

        if (self::$caseNo <= $prevCaseIndex) {
            return 0;
        }

        if ((self::sumKostnaderTiltakNOK1000() - self::$sumKostnaderTiltakNOK1000Value[$prevCaseIndex]) == 0) {
            return 0;
        }

        return (self::resultatNOK1000() - self::$resultatNOK1000Value[$prevCaseIndex]) / (self::sumKostnaderTiltakNOK1000() - self::$sumKostnaderTiltakNOK1000Value[$prevCaseIndex]);
    }

    // new Cell F55
    // =(F35-E35)/(F50-E50)
    public static function nytteKostRatio2()
    {
        $prevCaseIndex = strtolower(self::currentModel()) == 'vaccine' ? 2 : 1;

        self::$salgsinntekterNOK1000Value[self::$caseNo] = self::salgsinntekterNOK1000();
        // self::$resultatNOK1000Value[self::$caseNo] = self::resultatNOK1000();
        self::$sumKostnaderNOK1000Value[self::$caseNo] = self::sumKostnaderNOK1000();

        if (self::$caseNo <= $prevCaseIndex) {
            return 0;
        }

        if ((self::sumKostnaderNOK1000() - self::$sumKostnaderNOK1000Value[$prevCaseIndex]) == 0) {
            return 0;
        }

        return (self::salgsinntekterNOK1000() - self::$salgsinntekterNOK1000Value[$prevCaseIndex]) / (self::sumKostnaderNOK1000() - self::$sumKostnaderNOK1000Value[$prevCaseIndex]);
    }

    // Cell D54
    // =(D49*1000)/D18
    public static function prodkostPerKgHOG()
    {
        return self::solgtBiomasseTotHOG() == 0 ? 0 : self::sumKostnaderNOK1000() * 1000 / self::solgtBiomasseTotHOG();
    }

    // Cell D54
    // (D49*1000)/D18
    public static function forbedringProdkostPerKgHOG()
    {
        return self::solgtBiomasseTotHOG() == 0 ? 0 : (self::sumKostnaderNOK1000() * 1000) / self::solgtBiomasseTotHOG();
    }

    // Cell D55
    // (D35*1000)/D18
    public static function lakseprisGjennomsnittKrPerKg()
    {
        return self::solgtBiomasseTotHOG() == 0 ? 0 : (self::salgsinntekterNOK1000() * 1000) / self::solgtBiomasseTotHOG();
    }

    // Cell D56
    // D55-D54
    public static function marginNOKPerKg()
    {
        return self::lakseprisGjennomsnittKrPerKg() - self::forbedringProdkostPerKgHOG();
    }

    // Cell D57
    // (D15)/(D9-D10)
    public static function eFCR()
    {
        if ((self::solgtBiomasseRundVekt() - self::smoltBiomasse()) == 0) {
            return 0;
        }
        return self::feedVolumKg() / (self::solgtBiomasseRundVekt() - self::smoltBiomasse());
    }

    // Cell D57
    // =D24*1000/D14
    public static function feedprisPerKgProdusert()
    {
        return self::produsertBiomasse() == 0 ? 0 : self::innkjoptFeedNOK1000() * 1000 / self::produsertBiomasse();
    }

    // Cell D58
    // D9/D17
    public static function snittvektRund()
    {
        return self::antallSlaktetSolgt() == 0 ? 0 : self::solgtBiomasseRundVekt() / self::antallSlaktetSolgt();
    }

    // Cell D59
    // =D58*C59
    public static function slaktevektHOGKg()
    {
        return BPLM::konvFaktor() * self::snittvektRund();
    }

    // Cell D60
    // (E50-D50)/D50
    public static function endringResultatPercentage()
    {
        if (self::$caseNo == 1 || self::$resultatNOK1000Value[1] == 0) {
            return 0;
        }

        return (self::resultatNOK1000() - self::$resultatNOK1000Value[1]) / self::$resultatNOK1000Value[1];
    }

    // Cell D61
    public static function endringVolumSolgt()
    {
        self::$solgtBiomasseTotHOGValue[self::$caseNo] = self::solgtBiomasseTotHOG();

        if (self::$caseNo == 1 || self::$solgtBiomasseTotHOGValue[1] == 0) {
            return 0;
        }

        return (self::solgtBiomasseTotHOG() - self::$solgtBiomasseTotHOGValue[1]) / self::$solgtBiomasseTotHOGValue[1];
    }

    public static function forkost()
    {
        return self::$forkost;
    }

    // Cost of disease graph
    // Cell E67
    // =E39+(E25-D25)+E49
    public static function okteUtgifterNOK1000()
    {
        return self::ekstraordinareKostBehandlingForebyggingNOK1000() + (self::deadfiskEnsilasjeNOK1000() - self::$deadfiskEnsilasjeNOK1000Value[1]) + self::sumKostnaderTiltakNOK1000();
    }

    // Cell E68
    // =(D51-E51)-E67
    public static function biologiskeTapNOK1000()
    {
        return (self::$resultatNOK1000Value[1] - self::resultatNOK1000()) - self::okteUtgifterNOK1000();
    }

    // Cell E69
    // =E67+E68
    public static function costOfDiseaseNOK1000()
    {
        return self::okteUtgifterNOK1000() + self::biologiskeTapNOK1000();
    }

    // Cell E70
    // =E69+E51
    public static function kontroll()
    {
        return self::costOfDiseaseNOK1000() + self::sumKostnaderNOK1000();
    }

    public static function execute()
    {
        self::prodkostPerKgHOGCase1();
        self::deadfiskEnsilasjeNOK1000();
        self::fasteKostnaderPerArNOK1000();
        self::forbedringResultat();
        self::nytteKostRatio();
        self::nytteKostRatio2();
        self::endringResultatPercentage();
        self::endringVolumSolgt();
    }

}
