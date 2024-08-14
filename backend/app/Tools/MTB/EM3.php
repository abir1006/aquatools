<?php

namespace App\Tools\MTB;


class EM3
{
    private static $resultatValue;
    private static $salgsinntekterNOK1000;
    private static $sumKostnaderNOK1000;
    private static $sumKostnaderTiltakNOK1000Value;
    private static $snittProduksjonstidDagValue;
    private static $efcrValue;

    public static function antallKons()
    {
        return Oppdretter::antallKonsesjoner();
    }

    public static function smoltPerKons1000()
    {
        return self::antallKons() == 0 ? 0 : (self::smoltAntall1000() / self::antallKons());
    }

    public static function smoltAntall1000()
    {
        $part1 = self::slaktevektRundKg() - self::smoltvektKg();
        $part2 = $part1 == 0 ? 0 : MtbModul::tilSlaktTonn() / $part1;
        $part3 = self::dodfiskvektKg() == 0 ? 0 : (MtbModul::dodeTonn() / self::dodfiskvektKg());
        return $part2 + $part3;
    }

    public static function smoltkostNok1000()
    {
        return self::smoltAntall1000() * self::smoltPrisNOKPerStk();
    }

    public static function smoltvektKg()
    {
        return Oppdretter::smoltvektGram() / 1000;
    }

    public static function smoltPrisNOKPerStk()
    {
        return Oppdretter::smoltprisPerFisk() + (self::smoltvektKg() * Oppdretter::smoltprisPerKg());
    }

    public static function smoltBiomasseTonn()
    {
        return self::smoltAntall1000() * self::smoltvektKg();
    }

    public static function slaktevektRundKg()
    {
        return Oppdretter::slaktevektRundGram() / 1000;
    }

    public static function produsertBiomasseTonn()
    {
        return MtbModul::tonnProdusert();
    }

    public static function totalBiomasseTonn()
    {
        return self::produsertBiomasseTonn() + self::smoltBiomasseTonn();
    }

    public static function dodeAntall1000()
    {
        return self::dodfiskvektKg() == 0 ? 0 : MtbModul::dodeTonn() / self::dodfiskvektKg();
    }

    public static function utkastAntall1000()
    {
        return self::slaktevektRundKg() == 0 ? 0 : self::utkastT() / self::slaktevektRundKg();
    }

    public static function dodfiskvektKg()
    {
        return (Oppdretter::snittvektDodfiskAvSnittvekt() / 100) * Snittvekt::snittvekt() / 1000;
    }

    /**
     * D16
     *
     * @return float|int
     */

    public static function dodfiskBiomasse()
    {
        return MtbModul::dodeTonn();
    }

    /**
     * E17
     *
     * @return float|int
     */

    public static function spartForTonn()
    {
        $result = 0;
        $case_no = Oppdretter::caseNo();
        self::$efcrValue[$case_no] = self::efcr();

        if ($case_no > 1) {
            $result = self::solgtVolumRundTonn() * (self::$efcrValue[1] - self::efcr());
        }

        return $result;
    }

    public static function produsertBiomasse()
    {
        return MtbModul::tonnProdusert();
    }

    public static function innkjoptForT()
    {
        return self::produsertBiomasse() * Oppdretter::fcrb();
    }

    public static function forprisPerKg()
    {
        return Oppdretter::forpris();
    }

    private static function smoltNOK1000()
    {
        return self::smoltkostNok1000();
    }

    public static function innkjøptForNOK1000()
    {
        return self::innkjoptForT() * self::forprisPerKg();
    }

    public static function dodfiskEnsilasjeNOK1000()
    {
        return self::dodfiskBiomasse() * Oppdretter::dodfiskPerKg();
    }

    public static function innkjoringOgSlaktPerKgHOG()
    {
        return Oppdretter::innkjoringOgSlaktPerKgHOG();
    }

    public static function innkjøringOgSlakt()
    {
        return self::innkjoringOgSlaktPerKgHOG() * self::solgtVolumSloydT();
    }

    public static function variabelDriftskostPerKonsPerDag()
    {
        return (self::antallKons() * Oppdretter::variabelDrifstkostPerKonsOrDagNOK() * self::snittProduksjonstidDag(
                )) / 1000;
    }

    public static function variableKostnaderSum()
    {
        return self::variabelDriftskostPerKonsPerDag() + self::innkjøringOgSlakt() + self::innkjoringOgSlaktPerKgHOG(
            ) + self::dodfiskEnsilasjeNOK1000() + self::innkjøptForNOK1000() + self::smoltNOK1000();
    }

    public static function solgtVolumRundTonn()
    {
        return self::smoltBiomasseTonn() + MtbModul::slaktetRund();
    }

    public static function utkastT()
    {
        return MtbModul::utkastRundT();
    }

    public static function solgtVolumSloydT()
    {
        return self::solgtVolumRundTonn() * Oppdretter::konvetreringRundTilHOG();
    }

    public static function solgtVolumPerKonsT()
    {
        return self::solgtVolumSloydT() / self::antallKons();
    }

    public static function prodKvalitetNOK1000()
    {
        //.....Question....34...percentage divided 100
        return self::solgtVolumSloydT() * (Oppdretter::prodKvalitet(
                ) / 100) * Oppdretter::prodkvalitetRedusertPrisPerKg();
    }

    public static function utkastMil()
    {
        //.....Question....35 minus
        return MtbModul::utkastRundT() * (-1 * self::lakseprisNOKPerKgHOG()) * .86;
    }

    public static function lakseprisNOKPerKgHOG()
    {
        return Oppdretter::laksepris();
    }

    public static function salgsinntekterNOK1000()
    {
        return (self::lakseprisNOKPerKgHOG() * self::solgtVolumSloydT()) + self::prodKvalitetNOK1000();
    }

    public static function fasteKostnaderMillPerKons()
    {
        return Oppdretter::fasteKostNOKMillPerKons() * self::antallKons() * 1000;
    }

    public static function fastKostPerKgSloyd()
    {
        return self::fasteKostnaderMillPerKons() / self::solgtVolumRundTonn();
    }

    public static function tiltakPerArNOK1000()
    {
        return Investering::tiltakNOK1000PerAr();
    }

    /**
     * E41
     *
     * @return float|int
     */
    public static function ekstraKostnaderForNOK1000()
    {
        $result = 0;
        $case_no = Oppdretter::caseNo();
        if ($case_no > 1) {
            $result = Investering::merprisForNokKg() * self::innkjoptForT();
        }

        return $result;
    }

    public static function ekstraordinreKostnaderNOK1000PerAr()
    {
        return Investering::ekstraordinreKostnaderNOK1000PerAr();
    }

    public static function investeringAvskrivingNOK1000()
    {
        return Investering::avskrivingPerAr();
    }

    public static function investeringRentekost()
    {
        return Investering::rentePerAr();
    }

    /**
     * D45
     *
     * @return float|int
     */
    public static function sumKostnaderTiltakNOK1000()
    {
        return self::tiltakPerArNOK1000() +
            self::ekstraKostnaderForNOK1000() +
            self::ekstraordinreKostnaderNOK1000PerAr() +
            self::investeringAvskrivingNOK1000() + self::investeringRentekost();
    }

    public static function sumKostnaderNOK1000()
    {
        return self::sumKostnaderTiltakNOK1000() + self::fasteKostnaderMillPerKons() + self::variableKostnaderSum();
    }

    public static function resultat()
    {
        return self::salgsinntekterNOK1000() - self::variableKostnaderSum() - self::fasteKostnaderMillPerKons(
            ) - self::sumKostnaderTiltakNOK1000();
    }

    public static function driftsmargin()
    {
        return self::salgsinntekterNOK1000() == 0 ? 0 : (self::resultat() / self::salgsinntekterNOK1000());
    }

    public static function prodkostPerKgHOG()
    {
        return self::solgtVolumSloydT() == 0 ? 0 : (self::sumKostnaderNOK1000() / self::solgtVolumSloydT());
    }

    public static function marginPerKg()
    {
        return self::solgtVolumSloydT() == 0 ? 0 : self::resultat() / self::solgtVolumSloydT();
    }

    public static function lakseprisGjennomsnittKrOrKg()
    {
        return self::solgtVolumSloydT() == 0 ? 0 : (self::salgsinntekterNOK1000() / self::solgtVolumSloydT());
    }

    public static function eFCR()
    {
        $part1 = (self::solgtVolumRundTonn() - self::smoltBiomasseTonn());
        return $part1 == 0 ? 0 : self::innkjoptForT() / $part1;
    }

    public static function snittvektRund()
    {
        // Arnfinn old formula
//        $part1 = self::smoltAntall1000() - self::dodeAntall1000() - self::utkastAntall1000();
//        return $part1 == 0 ? 0 : self::solgtVolumRundTonn() / $part1;

        // Anrfinn new formula

        return Oppdretter::slaktevektRundGram() / 1000;
    }

    public static function snittvektSloyd()
    {
        return self::snittvektRund() * Oppdretter::konvetreringRundTilHOG();
    }

    public static function tonnPerKonsesjonPerAr()
    {
        return Oppdretter::antallKonsesjoner() == 0 ? 0 : (self::solgtVolumSloydT() / Oppdretter::antallKonsesjoner());
    }

    public static function snittProduksjonstidDag()
    {
        $a = self::slaktevektRundKg() * 1000;
        $b = self::smoltvektKg() * 1000;

        $c = pow($a, (1 / 3));
        $d = pow($b, (1 / 3));

        return (Oppdretter::vf3() * Oppdretter::snitttemp()) == 0 ? 0 : ((($c - $d) * 1000) / (Oppdretter::vf3() * Oppdretter::snitttemp()));
    }

    public static function snittProduksjonstidManed()
    {
        // return self::snittProduksjonstidDag() / 30.5; // Arnfinn new calculation
        return self::snittProduksjonstidDag() / 30; // Arnfinn old calculation
    }

    public static function dodeAkkPerGenerasjon()
    {
        return (self::dodeAntall1000() / self::smoltAntall1000()) * 100; // Arnfinn new calculation
    }

    //..............case 2 start.............
    public static function nytteKostRatio()
    {
        try {
            $case_no = Oppdretter::caseNo();
            self::$resultatValue[$case_no] = self::resultat();
            self::$sumKostnaderTiltakNOK1000Value[$case_no] = EM3::sumKostnaderTiltakNOK1000();

            if ($case_no > 1) {
                return (self::resultat() - self::$resultatValue[1]) / (self::sumKostnaderTiltakNOK1000() - self::$sumKostnaderTiltakNOK1000Value[1]);
            }
        } catch (\Exception $e) {
        }

        return 0;
    }

    public static function nytteKostRatio2()
    {
        $case_no = Oppdretter::caseNo();
        self::$salgsinntekterNOK1000[$case_no] = self::salgsinntekterNOK1000();
        self::$sumKostnaderNOK1000[$case_no] = self::sumKostnaderNOK1000();

        if ($case_no > 1 && (self::$sumKostnaderNOK1000[$case_no] - self::$sumKostnaderNOK1000[1]) != 0) {
            return (self::$salgsinntekterNOK1000[$case_no] - self::$salgsinntekterNOK1000[1]) / (self::$sumKostnaderNOK1000[$case_no] - self::$sumKostnaderNOK1000[1]);
        }

        return 0;
    }

    public static function reduserteDager()
    {
        $case_no = Oppdretter::caseNo();
        self::$snittProduksjonstidDagValue[$case_no] = self::snittProduksjonstidDag();

        if ($case_no > 1) {
            return self::$snittProduksjonstidDagValue[1] - self::snittProduksjonstidDag();
        }

        return 0;
    }

    public static function reduksjonRisikotid()
    {
        try {
            $case_no = Oppdretter::caseNo();
            self::$snittProduksjonstidDagValue[$case_no] = self::snittProduksjonstidDag();

            if ($case_no > 1) {
                $match = (self::$snittProduksjonstidDagValue[1] - self::snittProduksjonstidDag(
                        )) / self::$snittProduksjonstidDagValue[1];
                return $match * 100;
            }
        } catch (\Exception $e) {
        }

        return 0;
    }

    public static function forbedringResultat()
    {
        $case_no = Oppdretter::caseNo();
        self::$resultatValue[$case_no] = self::resultat();

        if ($case_no > 1) {
            return self::resultat() - self::$resultatValue[1];
        }

        return 0;
    }

    public static function forbedringResultatPercentage()
    {
        try {
            $case_no = Oppdretter::caseNo();
            self::$resultatValue[$case_no] = self::resultat();

            if ($case_no > 1) {
                $match = (self::resultat() - self::$resultatValue[1]) / self::$resultatValue[1];
                return $match * 100;
            }
        } catch (\Exception $e) {
        }

        return 0;
    }

}
