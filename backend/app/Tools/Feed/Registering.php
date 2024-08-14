<?php

namespace App\Tools\Feed;

use App\Tools\Modules\bPLM_EM\BPLM;
use App\Tools\Modules\bPLM_EM\EM;
use App\Tools\ToolsOutputInterface;
use DateInterval;
use DatePeriod;
use DateTime;
use phpDocumentor\Reflection\Types\Self_;

class Registering
{
    public static $case_no;
    public static $goal;
    public static $lokalitet;
    public static $generasjon;
    public static $navn;
    public static $antall_utsatt;
    public static $snittvekt;
    public static $utsettsdato;
    public static $harvest_date;
    public static $akkumulert_dodelighet;
    public static $temperature_module;
    public static $andel_superior;
    public static $andel_nedklasset;
    public static $andel_vrak;
    public static $omregningsfaktor_sloyd;
    public static $reduksjon_nedklassing_prosentpoeng;
    public static $reduksjon_vrak_prosentpoeng;
    public static $reduksjon_dode_prosentpoeng;
    public static $forbedring_omregningsfaktor_sloyd;
    public static $laksepris;
    public static $prodkost_netto_slaktet;
    public static $utsettskostnader_per_stk;
    public static $slaktekostnad_rund_inkl_bronnbat;
    public static $ensilasje_kr_pr_kg_dode;
    public static $redusert_pris_nedklassing;
    public static $feed_table;
    public static $casesLastDate;

    public static function setInputs(
        $feed_table,
        $case_no = 1,
        $goal = '',
        $lokalitet = '',
        $generasjon = '',
        $navn = '',
        $antall_utsatt = 1000000,
        $snittvekt = 135,
        $utsettsdato = "5/01/2018",
        $harvest_date = "12/18/2019",
        $akkumulert_dodelighet = 10,
        $temperature_module = '',
        $andel_superior = 95,
        $andel_nedklasset = 3,
        $andel_vrak = 2,
        $omregningsfaktor_sloyd = 0.84,
        $reduksjon_nedklassing_prosentpoeng = 0.25,
        $reduksjon_vrak_prosentpoeng = 0.25,
        $reduksjon_dode_prosentpoeng = 0.5,
        $forbedring_omregningsfaktor_sloyd = 0.84,
        $laksepris = 60,
        $prodkost_netto_slaktet = 35,
        $utsettskostnader_per_stk = 14,
        $slaktekostnad_rund_inkl_bronnbat = 3.5,
        $ensilasje_kr_pr_kg_dode = 2,
        $redusert_pris_nedklassing = 10
    ) {
        self::$feed_table = $feed_table;
        self::$case_no = $case_no;
        self::$goal = $goal;
        self::$lokalitet = $lokalitet;
        self::$generasjon = $generasjon;
        self::$navn = $navn;
        self::$antall_utsatt = $antall_utsatt;
        self::$snittvekt = $snittvekt;
        self::$utsettsdato = $utsettsdato;
        self::$harvest_date = $harvest_date;
        self::$akkumulert_dodelighet = $akkumulert_dodelighet;
        self::$temperature_module = $temperature_module;
        self::$andel_superior = $andel_superior;
        self::$andel_nedklasset = $andel_nedklasset;
        self::$andel_vrak = $andel_vrak;
        self::$omregningsfaktor_sloyd = $omregningsfaktor_sloyd;
        self::$reduksjon_nedklassing_prosentpoeng = $reduksjon_nedklassing_prosentpoeng;
        self::$reduksjon_vrak_prosentpoeng = $reduksjon_vrak_prosentpoeng;
        self::$reduksjon_dode_prosentpoeng = $reduksjon_dode_prosentpoeng;
        self::$forbedring_omregningsfaktor_sloyd = $forbedring_omregningsfaktor_sloyd;
        self::$laksepris = $laksepris;
        self::$prodkost_netto_slaktet = $prodkost_netto_slaktet;
        self::$utsettskostnader_per_stk = $utsettskostnader_per_stk;
        self::$slaktekostnad_rund_inkl_bronnbat = $slaktekostnad_rund_inkl_bronnbat;
        self::$ensilasje_kr_pr_kg_dode = $ensilasje_kr_pr_kg_dode;
        self::$redusert_pris_nedklassing = $redusert_pris_nedklassing;
    }

    public static function caseNo()
    {
        return self::$case_no;
    }

    public static function goal()
    {
        return self::$goal;
    }

    public static function lokalitet()
    {
        return self::$lokalitet;
    }

    public static function navn()
    {
        return self::$navn;
    }

    public static function generasjon()
    {
        return self::$generasjon;
    }

    public static function antallUtsatt()
    {
        return self::$antall_utsatt;
    }

    public static function snittvekt()
    {
        return self::$snittvekt;
    }

    public static function utsettsdato()
    {
        return date('m/d/Y', strtotime(str_replace('/', '-', self::$utsettsdato)));
    }

    public static function harvestDate()
    {
        return date('m/d/Y', strtotime(str_replace('/', '-', self::$harvest_date)));
    }

    public static function akkumulertDodelighet()
    {
        return self::$akkumulert_dodelighet;
    }

    public static function temperatureModule()
    {
        return self::$temperature_module;
    }

    public static function andelSuperior()
    {
        return self::$andel_superior;
    }

    public static function andelNedklasset()
    {
        return self::$andel_nedklasset;
    }

    public static function andelVrak()
    {
        return self::$andel_vrak;
    }

    public static function omregningsfaktorSloyd()
    {
        return self::$omregningsfaktor_sloyd;
    }

    public static function reduksjonNedklassingProsentpoeng()
    {
        return self::$reduksjon_nedklassing_prosentpoeng;
    }

    public static function reduksjonVrakProsentpoeng()
    {
        return self::$reduksjon_vrak_prosentpoeng;
    }

    public static function reduksjonDodeProsentpoeng()
    {
        return self::$reduksjon_dode_prosentpoeng;
    }

    public static function forbedringOmregningsfaktorSloyd()
    {
        return self::$forbedring_omregningsfaktor_sloyd;
    }

    public static function laksepris()
    {
        return self::$laksepris;
    }

    public static function prodkostNettoSlaktet()
    {
        return self::$prodkost_netto_slaktet;
    }

    public static function utsettskostnaderPerStk()
    {
        return self::$utsettskostnader_per_stk;
    }

    public static function slaktekostnadRundInklBronnbat()
    {
        return self::$slaktekostnad_rund_inkl_bronnbat;
    }

    public static function ensilasjeKrPrKgDode()
    {
        return self::$ensilasje_kr_pr_kg_dode;
    }

    public static function redusertPrisNedklassing()
    {
        return self::$redusert_pris_nedklassing;
    }

    public static function feedTable()
    {
        return self::$feed_table;
    }

    // Output PDF

    private static function slaktetBiomasseNettoTonn()
    {
        return (BackgroundCalculation::slakteVekt() * BackgroundCalculation::slakteAntall() * 0.86 / 1000) / 1000;
    }

    private static function forkostMill()
    {
        return BackgroundCalculation::totalForkost() / 1000000;
    }

    private static function forprisPerKgFor()
    {
        return BackgroundCalculation::totalForkost() / BackgroundCalculation::totalFeed();
    }

    private static function forkostPerKgProdusert()
    {
        return self::forkostMill() * 1000 / self::slaktetBiomasseNettoTonn();
    }

    // Print PDF
    private static function driftsResultat()
    {
        return EM::resultatNOK1000() / 1000;
    }

    private static function marginPercentage()
    {
        return EM::driftsmargin() * 100;
    }

    private static function vektutvikling()
    {

        //feed data
        $feedTable = BackgroundCalculation::$timeline;
        $duration = end($feedTable)['duration'];
        $lastFeed = explode('-', $duration);
        $feedLastDate = trim($lastFeed[1]);

        // get all dates between release and harvenst in an array
        $period = new DatePeriod(
            new DateTime(self::utsettsdato()),
            new DateInterval('P3M'),
            new DateTime(self::harvestDate())
        );

        $graphProductionDates = [];
        foreach ($period as $key => $value) {
            $graphProductionDates[] = str_replace('-', '/', $value->format('d-m-Y'));
        }

        //add feed last date to array
        if (!in_array($feedLastDate, $graphProductionDates))
            $graphProductionDates[] = $feedLastDate;

        // filter outs all dates after feed last date
        $graphProductionDates = collect($graphProductionDates)
            ->filter(function ($date) use ($feedLastDate) {
                $feedLastDate = str_replace('/', '-', $feedLastDate);
                $itemDate = str_replace('/', '-', $date);
                return strtotime($itemDate) <= strtotime($feedLastDate);
            })
            ->toArray();

        // extract vekts and temp after each three months
        $weightByDateTemp = BackgroundCalculation::vektutvikling();

        $graphDates = [];
        foreach ($weightByDateTemp as $date => $data) {
            if (in_array($date, $graphProductionDates)) {
                $graphDates[$date] = $data;
            }
        }

        // add last date to array
        self::$casesLastDate[self::caseNo()] = $feedLastDate;

        // add all cases last date to each case output
        foreach (self::$casesLastDate as $caseNo => $date) {

            $dt1 = str_replace('/', '-', $date);
            $dt2 = str_replace('/', '-', $feedLastDate);

            if (!in_array($date, array_keys($graphDates)) && (strtotime($dt1) <= strtotime($dt2)))
                $graphDates[$date] = $weightByDateTemp[$date];
        }

        //sort array according to date
        uksort($graphDates, function ($dt1, $dt2) {
            $dt1 = str_replace('/', '-', $dt1);
            $dt2 = str_replace('/', '-', $dt2);

            return strtotime($dt1) - strtotime($dt2);
        });

        return $graphDates;
    }

    private static function totalVariableKost()
    {
        return (EM::variableKostnaderSumNOK1000() / EM::prodkostTotalNOK1000()) * 100;
    }

    //.............test methods start..............
    public static function testBackgroundCalculation()
    {
        $result = [];
        $class_methods = get_class_methods(new BackgroundCalculation());
        foreach ($class_methods as $method_name) {
            if ($method_name !== 'getFeedTable' && $method_name !== 'timeline' && $method_name !== 'getWeeklyAvgTemperature') {
                $result[$method_name] = BackgroundCalculation::$method_name();
            }
        }
        return $result;
    }

    public static function testBPLM()
    {
        $result = [];
        $class_methods = get_class_methods(new BPLM());
        foreach ($class_methods as $method_name) {
            $result[$method_name] = BPLM::$method_name();
        }
        return $result;
    }

    public static function testEM()
    {
        $result = [];
        $class_methods = get_class_methods(new EM());
        foreach ($class_methods as $method_name) {
            $result[$method_name] = EM::$method_name();
        }
        return $result;
    }

    public static function output(ToolsOutputInterface $toolsOutput)
    {
        $outputData = array(
            'graphs' => array(
                'slaktevektRund' => number_format(BackgroundCalculation::slakteVekt(), 2),
                'tonnSloyd' => number_format(self::slaktetBiomasseNettoTonn(), 2),
                'efcr' => number_format(BackgroundCalculation::efcr(), 2),
                'forprisPerKgFor' => number_format(EM::feedPris(), 2),
                'prodkostPerKg' => number_format(EM::prodkostPerKgHOG(), 2),
                'driftsResultat' => number_format(self::driftsResultat(), 2),
//                'nytteKostRatio' => number_format(EM::nytteKostRatio(), 1),
                'nytteKostRatio2' => number_format(EM::nytteKostRatio2(), 1),
                'forkostPerKg' => number_format(EM::feedprisPerKgProdusert(), 2),
                'mortality' => number_format(BackgroundCalculation::deadPercentage(), 2)
            ),

            'vektutvikling' => self::vektutvikling(),

            'pdf' => array(
                'totalProdKostCase1' => number_format((EM::prodkostTotalNOK1000()), 2, '.', ' '),
                'totalVariableKost' => number_format((self::totalVariableKost()), 2, '.', ' '),
                'lokalitet' => self::lokalitet(),
                'generasjon' => self::generasjon(),
                'ansvarlig' => self::navn(),
                'utsettsDato' => self::utsettsdato(),
                'utsettsVekt' => self::snittvekt(),
                'antallSmolt' => number_format(self::antallUtsatt(), 0, '.', ' '),
                'mortality' => number_format(BackgroundCalculation::deadPercentage(), 2, '.', ' '),
                'slakteDato' => self::harvestDate(),
                'dagerIProduksjon' => BackgroundCalculation::dagerTilSlakt(),
                'slaktevekt' => number_format(BackgroundCalculation::slakteVekt(), 0, '.', ' '),
                'vf3' => number_format(BackgroundCalculation::vf3(), 2, '.', ' '),
                'tilvekstKg' => number_format(BackgroundCalculation::nettoTilvekst(), 0, '.', ' '),
                'slaktetBiomasseNettoTonn' => number_format(self::slaktetBiomasseNettoTonn(), 1, '.', ' '),
                'bfcr' => number_format(BackgroundCalculation::bfcr(), 2, '.', ' '),
                'efcr' => number_format(BackgroundCalculation::efcr(), 2, '.', ' '),
                'FormengdeKg' => number_format(BackgroundCalculation::totalFeed(), 0, '.', ' '),
                'forkostMill' => number_format(self::forkostMill(), 1, '.', ' '),
                'forprisPerKgFor' => number_format(EM::feedPris(), 2, '.', ' '),
                'forkostPerKgProdusert' => number_format(EM::feedprisPerKgProdusert(), 2, '.', ' '),
                'prodkostPerKg' => number_format(EM::prodkostPerKgHOG(), 2, '.', ' '),
                'inntekterMill' => number_format(EM::salgsinntekterNOK1000(), 1, '.', ' '),
                'kostnaderMill' => number_format(EM::sumKostnaderNOK1000(), 1, '.', ' '),
                'driftsResultatMill' => number_format(self::driftsResultat(), 1, '.', ' '),
                'marginPercentage' => number_format(self::marginPercentage(), 2, '.', ' '),
//                'kostNytteRatio' => number_format(EM::nytteKostRatio(), 1, '.', ' '),
                'kostNytteRatio2' => number_format(EM::nytteKostRatio2(), 1, '.', ' ')
            ),
            'timeline' => BackgroundCalculation::$timeline,
            'slaktevekt' => BackgroundCalculation::slakteVekt(),
        );

        $outputData = $toolsOutput->formatOutput($outputData);

        return $outputData;
    }
}
