<?php

namespace App\Tools\Feed;

use Exception;

class BackgroundCalculation
{
    public static $timeline = [];
    public static $vekts = [];
    public static $bfcr = [];
    public static $antall = [];
    public static $dead = [];
    public static $bio = [];
    public static $dead_bio = [];
    public static $forpris = [];
    public static $mortality = [];
    public static $formengde = [];
    public static $forkost = [];
    public static $daily_temperature = [];
    private static $weightTempByDate = [];
    private static $production_dates = [];
    private static $deadPercentageValue = [];

    /**
     * @return mixed
     * @throws Exception
     */
    public static function totalDays()
    {
        $date1 = new \DateTime(Registering::utsettsdato());
        $date2 = new \DateTime(Registering::harvestDate());
        return $date1->diff($date2)->days;
    }

    /**
     * @return mixed
     *
     * Algorithm for feed growth and timeline
     * @throws Exception
     */
    public static function timeline()
    {
        $dates = [];
        self::$vekts = [];
        self::$bfcr = [];
        self::$dead = [];
        self::$bio = [];
        self::$dead_bio = [];
        self::$forpris = [];
        self::$formengde = [];
        self::$forkost = [];
        $feed_table = self::getFeedTable();
        $start_day = 1;
        self::$vekts = [];
        if (isset($feed_table) && is_array($feed_table) && count($feed_table) > 0) {
            foreach ($feed_table as $key => $feed) {
                // finding weight till reach harvest date
                for ($day = $start_day; $day <= self::totalDays() + 1; $day++) {
                    // Calculate antall
                    self::antall($day);
                    $vf3 = null;
                    $bfcr = null;
                    $feed_cost = null;
                    $next_day = $day - 1;
                    $harvest_date = date(
                        'm/d/Y',
                        strtotime('+' . $next_day . ' day', strtotime(Registering::utsettsdato()))
                    );
                    $prev_harvest_date = date('m/d/Y', strtotime('-1 day', strtotime($harvest_date)));
                    $vekt = $day == 1 ? Registering::snittvekt() : self::$vekts[$day - 1];

                    // Apply various feeds's weight, vf3, temperature data during harvest date
                    if ($vekt <= $feed['feed_max_weight']) {
                        $vf3 = $feed['vf3'];
                        self::$mortality[$day] = !isset($feed['mortality']) || $feed['mortality'] == '' ? 0 : ($feed['mortality'] / 100);
                        self::$bfcr[$day] = $feed['bfcr'];
                        self::$forpris[$day] = $feed['feed_cost'];
                        $dates[$key][] = $day == 1 || $day == self::totalDays(
                        ) + 1 ? $harvest_date : $prev_harvest_date;
                    }

                    if ($vf3 == null) {
                        $start_day = $day - 1;
                        unset(self::$vekts[$day]);
                        break;
                    }

                    // Calculate growth/ vekt using formula Feed Model Demo Data sheet from E4
                    self::$vekts[$day] = $day == 1 ? Registering::snittvekt() : pow(
                        pow(self::$vekts[$day - 1], 1 / 3) + ((self::getWeeklyAvgTemperature(
                                    $harvest_date,
                                    $day
                                ) / 1000) * $vf3),
                        3
                    );

                    self::bio($day);
                    self::dead($day);
                    self::deadBio($day);
                    self::formengde($day);
                    self::forkost($day);

                    // for Vektutvikling graph
                    $dateObj = explode('/', $harvest_date);
                    $production_date = $dateObj[1] . '/' . $dateObj[0] . '/' . $dateObj[2];
                    self::$production_dates[] = $production_date;
                    self::$weightTempByDate[$production_date] = [
                        'vekt' => self::$vekts[$day],
                        'temp' => number_format(self::getWeeklyAvgTemperature($harvest_date, $day), 2),
                    ];
                }
            }
        }

        $harvest_date_obj = explode('/', Registering::harvestDate());
        $harvest_date = $harvest_date_obj[1] . '-' . $harvest_date_obj[0] . '-' . $harvest_date_obj[2];

        // Add duration into feed timeline to achieve respective weight ranges
        if (count($feed_table) > 0) {
            foreach ($dates as $key => $date) {
                //$start_date = date('d/m/Y', strtotime($date[0]));
                $start_date = $key == 0 ? date('d/m/Y', strtotime($date[0])) : date(
                    'd/m/Y',
                    strtotime(
                        '+1 day',
                        strtotime(
                            $dates[$key - 1][count(
                                $dates[$key - 1]
                            ) - 1]
                        )
                    )
                );

                $start_date_tmp = str_replace('/', '-', $start_date);

                //echo ' | '.strtotime($start_date_tmp) .' | '.strtotime($harvest_date);

                if (strtotime($start_date_tmp) > strtotime($harvest_date)) {
                    $max_index = count($feed_table) - 1;
                    for ($i = $key; $i <= $max_index; $i++) {
                        unset($feed_table[$i]);
                    }
                    //unset($feed_table[$key]);
                    break;
                }

                $feed_table[$key]['duration'] = $start_date . ' - ' . date(
                        'd/m/Y',
                        strtotime(
                            $date[count(
                                $date
                            ) - 1]
                        )
                    );
            }
        }

        self::$timeline = $feed_table;
    }

    /**
     * @param string $date
     * @param int $day
     * @return mixed
     * @throws Exception
     */
    public static function getWeeklyAvgTemperature($date = '', $day = 1)
    {
        $dateObj = new \DateTime($date);
        $week = (int)$dateObj->format('W');
        $temperature_data = Registering::temperatureModule();

        // find avg. temperature of current harvesting week from temperature module dat
        $key = array_search($week, array_column($temperature_data, 'week'));
        self::$daily_temperature[$day] = $temperature_data[$key]['avgTmp'];
        return $temperature_data[$key]['avgTmp'];
    }

    public static function getFeedTable()
    {
        return Registering::feedTable();
    }

    public static function antall($day = 1)
    {
        self::$antall[$day] = $day == 1 ? Registering::antallUtsatt() : self::$antall[$day - 1] - self::$dead[$day - 1];
    }

    public static function dead($day = 1)
    {
        self::$dead[$day] = self::$antall[$day] * (1 - pow(
                    (1 - self::$mortality[$day]),
                    (1 / (self::dagerTilSlakt() + 1))
                )); // total days + 1
    }

    // Cell C2
    public static function dagerTilSlakt()
    {
        return self::totalDays() + 1;
    }

    public static function bio($day = 1)
    {
        self::$bio[$day] = self::$antall[$day] * self::$vekts[$day] / 1000;
    }

    public static function deadBio($day = 1)
    {
        $vekt = $day > 1 ? self::$vekts[$day - 1] : self::$vekts[$day];
        self::$dead_bio[$day] = self::$dead[$day] * $vekt / 1000;
    }

    // Cell J4
    public static function formengde($day = 1)
    {
        self::$formengde[$day] = $day == 1 ? 0 : (self::$vekts[$day] - self::$vekts[$day - 1]) * self::$antall[$day] / 1000 * self::$bfcr[$day];
    }

    // Cell K4
    public static function forkost($day = 1)
    {
        self::$forkost[$day] = $day == 1 ? 0 : (self::$formengde[$day] * self::$forpris[$day]);
    }

    // Cell C2
    public static function dogngr()
    {
        $temp = array_slice(self::$daily_temperature, 0, (self::dagerTilSlakt() + 1)); // total days + 1
        return array_sum($temp);
    }

    // Cell
    public static function nettoTilvekst()
    {
        return (self::slakteVekt() * self::slakteAntall() / 1000) - self::$bio[1];
    }

    // Cell H1
    public static function totalForkost()
    {
        return array_sum(self::$forkost);
    }

    // Cell J1
    public static function totalFeed()
    {
        return array_sum(self::$formengde);
    }

    // Cell M1
    public static function vf3()
    {
        $data1 = pow(self::slakteVekt(), 1 / 3);
        $data2 = pow(self::$vekts[1], 1 / 3);
        return self::dogngr() == 0 ? 0 : ($data1 - $data2) / self::dogngr() * 1000;
    }

    // Cell S1
    public static function sgr()
    {
        $sgr = (log(self::slakteVekt()) - log(self::$vekts[1])) / (self::dagerTilSlakt() + 1);
        return $sgr * 100;
    }

    public static function slakteVekt()
    {
        return end(self::$vekts);
    }

    public static function slakteAntall()
    {
        return end(self::$antall);
    }

    public static function bruttoTilvekst()
    {
        return self::nettoTilvekst() + array_sum(self::$dead_bio);
    }

    // Cell H2
    public static function deadPercentage()
    {
        return (array_sum(self::$mortality) * 100) / (self::totalDays() + 1);

//        $total_mortality = 0;
//        foreach (self::$timeline as $case => $timeline) {
//            $mortality = !isset($timeline['mortality']) || $timeline['mortality'] == '' ? 0 : $timeline['mortality'];
//            $start_date = date('m/d/Y', strtotime(str_replace('/', '-', trim(explode('-', $timeline['duration'])[0]))));
//            $end_data = date('m/d/Y', strtotime(str_replace('/', '-', trim(explode('-', $timeline['duration'])[1]))));
//            $date1 = new \DateTime($start_date);
//            $date2 = new \DateTime($end_data);
//            $total_mortality = $total_mortality + $date1->diff($date2)->days * $mortality;
//        }
//
//        return self::totalDays() == 0 ? 0 : $total_mortality / self::totalDays();

//        self::$deadPercentageValue[Registering::caseNo()] = Registering::akkumulertDodelighet();
//        if (Registering::caseNo() > 1) {
//            return (self::$deadPercentageValue[1] - Registering::akkumulertDodelighet()) / 100;
//        }
//        return Registering::akkumulertDodelighet() / 100;
    }

    // Cell J2
    public static function efcr()
    {
        return self::nettoTilvekst() == 0 ? 0 : self::totalFeed() / self::nettoTilvekst();
    }

    // Cell M2
    public static function bfcr()
    {
        return self::bruttoTilvekst() == 0 ? 0 : self::totalFeed() / self::bruttoTilvekst();
    }

    public static function slakteDato()
    {
        return Registering::harvestDate();
    }

    public static function sgrVektKontroll()
    {
        return self::$vekts[1] * exp(self::sgr() * (self::dagerTilSlakt() + 1)); // total days + 1
    }

    //
    public static function avgDeadVektKg()
    {
        return array_sum(self::$dead) == 0 ? 0 : array_sum(self::$dead_bio) / array_sum(self::$dead);
    }

    public static function avgFeedPrisKg()
    {
        return array_sum(self::$formengde) == 0 ? 0 : array_sum(self::$forkost) / array_sum(self::$formengde);
    }

    public static function vektutvikling()
    {
        return self::$weightTempByDate;
    }

    public static function productionDates()
    {
        return self::$production_dates;
    }
}
