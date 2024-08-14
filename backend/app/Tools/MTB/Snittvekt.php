<?php

namespace App\Tools\MTB;

class Snittvekt
{

    public static $biomassTotal;
    public static $totalRowCount;
    public static $biomasseSnittTotal;

    public static function dag0()
    {
        return EM3::smoltvektKg() * 1000;
    }

    public static function vf3()
    {
        return Oppdretter::vf3();
    }

    public static function dogngrader()
    {
        return Oppdretter::snitttemp();
    }

    public static function utsettvekt()
    {
        return EM3::smoltvektKg() * 1000;
    }

    public static function slaktevekt()
    {
        return EM3::slaktevektRundKg() * 1000;
    }

    public static function snittvekt()
    {
        return self::$totalRowCount == 0 ? 0 : (self::$biomassTotal / self::$totalRowCount);
        //....average I:I.....
        //return self::biomasseAverageIfs();
        //return 1954.7;
    }

    public static function biomasse()
    {
        //....sum I:I.....
        return self::$biomassTotal;
        //return 846088.59106;
    }

    public static function biomasseSnitt()
    {
        self::biomasse();
        //....sum K:K, I:I.....
        return self::$biomasseSnittTotal;
        //return 3171.92;
    }

    public static function biomasseSumIfs()
    {
        $sum_result = 0;
        $prev_result = self::dag0();
        $row_count = 0;

        for ($i = 0; $i < 549; $i++) {
            $prev_result = $prev_result;

            $a = pow($prev_result, (1 / 3));
            $b = (self::vf3() / 1000) * self::dogngrader();
            $total = $a + $b;
            $c = pow($total, 3);

            $prev_result = $c;

            if ($prev_result > self::utsettvekt() && $prev_result < self::slaktevekt()) {
                $row_count++;
                $sum_result += $prev_result;
                self::$biomassTotal = $sum_result;
                self::$totalRowCount = $row_count;
            }
        }

        return $sum_result;
    }


    public static function biomasseSnittSumIfs()
    {
        $sum_result = 0;
        $prev_result = self::dag0();

        for ($i = 0; $i < 549; $i++) {
            $prev_result = $prev_result;

            $a = pow($prev_result, (1 / 3));
            $b = (self::vf3() / 1000) * self::dogngrader();
            $total = $a + $b;
            $c = pow($total, 3);

            $prev_result = $c;

            if ($prev_result > self::utsettvekt() && $prev_result < self::slaktevekt()) {
                $j = $prev_result / self::$biomassTotal;
                $k = $prev_result * $j;
                $sum_result += $k;
                self::$biomasseSnittTotal = $sum_result;
            }
        }
        return $sum_result;
    }


    public static function biomasseAverageIfs()
    {
        $row_count = 0;
        $sum_result = 0;
        $prev_result = self::dag0();

        for ($i = 0; $i < 549; $i++) {
            $prev_result = $prev_result;

            $a = pow($prev_result, (1 / 3));
            $b = (self::vf3() / 1000) * self::dogngrader();
            $total = $a + $b;
            $c = pow($total, 3);

            $prev_result = $c;

            if ($prev_result > self::utsettvekt() && $prev_result < self::slaktevekt()) {
                $sum_result += $prev_result;
                $row_count++;
            }
        }
        return $sum_result / $row_count;
    }


}
