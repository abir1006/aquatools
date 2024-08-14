<?php


namespace App\Tools;


class ExcelHelper
{
    /**
     * @param float $x
     * @return float|int
     */
    public static function normsdist($x = 0.25)
    {
        $b1 = 0.319381530;
        $b2 = -0.356563782;
        $b3 = 1.781477937;
        $b4 = -1.821255978;
        $b5 = 1.330274429;
        $p = 0.2316419;
        $c = 0.39894228;

        if ($x >= 0.0) {
            $t = 1.0 / (1.0 + $p * $x);
            return (1.0 - $c * exp(-$x * $x / 2.0) * $t *
                ($t * ($t * ($t * ($t * $b5 + $b4) + $b3) + $b2) + $b1));
        } else {
            $t = 1.0 / (1.0 - $p * $x);
            return ($c * exp(-$x * $x / 2.0) * $t *
                ($t * ($t * ($t * ($t * $b5 + $b4) + $b3) + $b2) + $b1));
        }
    }

    public static function historicAverageIfs($data, $avg_col_index, $period_start, $period_end)
    {
        $total = 0;
        $count_record = 0;

        $period_start = explode('-', $period_start);
        $year_start = $period_start[0];
        $week_start = $period_start[1];

        $period_end = explode('-', $period_end);
        $year_end = $period_end[0];
        $week_end = $period_end[1];

        foreach ($data as $rk => $row) {
            if (($row['Year'] >= $year_start && $row['Week'] >= $week_start) && ($row['Year'] <= $year_end && $row['Week'] <= $week_end)) {
                if ($avg_col_index === 'Average Price') {
                    $count_record++;
                    $total = $total + $row[$avg_col_index];
                } else {
                    $count_record++;
                    $total = $total + $row['vekting'][$avg_col_index];
                }
            }
        }

        return $count_record == 0 ? 0 : ($total / $count_record); // return average value
    }

    public static function forwardAverageIfs($data, $avg_col_index, $period_start, $period_end)
    {
        $total = 0;
        $count_record = 0;

        foreach ($data as $rk => $row) {
            // check period ranges match
            if ($row[0] >= $period_start && $row[0] <= $period_end) {
                $count_record++;
                $total = $total + $row[$avg_col_index];
            }
        }

        return $count_record == 0 ? 0 : ($total / $count_record); // return average value
    }
}
