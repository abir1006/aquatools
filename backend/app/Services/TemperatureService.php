<?php

namespace App\Services;

use App\Models\Temperature;
use Config;
use Illuminate\Support\Facades\Auth;

class TemperatureService
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }


    public function findOne($id)
    {
        return Temperature::with('user', 'company')->find($id);
    }
    public function list()
    {
        $getCurrentUser = $this->userService->getLoggedInUser();

        return Temperature::with('company', 'user')
            ->when(!$getCurrentUser->isAdmin(), function ($q) use ($getCurrentUser) {
                $q->where('user_id', $getCurrentUser->id);
            });
    }


    public function save($data)
    {
        return Temperature::create($data);
    }


    public function delete($id)
    {
        $templete = Temperature::findOrFail($id);
        return $templete->user_id == $this->userService->getLoggedInUser()->id ? $templete->delete() : false;
    }

    public function update($data, $id)
    {
        $name = [
            'name' => $data['name']
        ];
        $templete = Temperature::findOrFail($id);
        return $templete->user_id == $this->userService->getLoggedInUser()->id ? $templete->update($name) : false;
    }



    /**
     * @param $template_name
     * @param int $wk
     * @return string
     * This method will return average temperature of a week from defined template
     */
    public function _getAvgTempByWeek($template_name, $wk = 1)
    {
        $temp_model = Temperature::where('name', $template_name)->first();
        $temp_template = json_decode($temp_model['template_data']);
        if (isset($temp_template->average->week->$wk->average)) {
            return $temp_template->average->week->$wk->average;
        }

        return "Provided Week Value not setted";
        /* return response()->json([
             'message' => 'Temperature Data Save Successfully',
         ], 200);*/
    }

    public function _averageTemperatureCalculation($temp_array)
    {

        $average_calc_arr = array();

        $years = [];
        $week53 = [];

        for ($j = 0; $j < count($temp_array); $j++) {
            foreach ($temp_array[$j]['data'] as $data_key => $data_item) {
                //$randomize_value = $data_item['seaTemperature'] * ((mt_rand() / mt_getrandmax()) + 1);
                $randomize_value = $data_item['seaTemperature'];

                // handle 53 week
                $years[$temp_array[$j]['year']] = 0;

                if ($data_item['week'] == 53) {
                    unset($years[$temp_array[$j]['year']]);
                    $week53[53] = $years;
                }

                $average_calc_arr['temperature_data'][$data_item['week']][$temp_array[$j]['year']] = $randomize_value;


                // Initially set week total temperature as 0

                if (!isset($average_calc_arr['temperature_data'][$data_item['week']]['total'])) {
                    $average_calc_arr['temperature_data'][$data_item['week']]['total'] = 0;
                }
                // Calculating (Summing) all year particular week total randomized temperature
                $average_calc_arr['temperature_data'][$data_item['week']]['total'] += $randomize_value;

                // Initially set week count value as 0, which later will be used for average calculation
                if (!isset($average_calc_arr['temperature_data'][$data_item['week']]['count'])) {
                    $average_calc_arr['temperature_data'][$data_item['week']]['count'] = 0;
                }
                if ($randomize_value != 0) {
                    $average_calc_arr['temperature_data'][$data_item['week']]['count']++;
                }
                if ($j == count($temp_array) - 1) {
                    if (!isset($average_calc_arr['temperature_data'][$data_item['week']]['Avg.'])) {
                        $average_calc_arr['temperature_data'][$data_item['week']]['Avg.'] = 0;
                    }
                    if ($average_calc_arr['temperature_data'][$data_item['week']]['count'] != 0) {
                        $average_calc_arr['temperature_data'][$data_item['week']]['Avg.'] = $average_calc_arr['temperature_data'][$data_item['week']]['total'] / $average_calc_arr['temperature_data'][$data_item['week']]['count'];
                    }
                }
            }
        }

        if (count($week53) > 0) {
            $average_calc_arr['temperature_data'][53] = $week53[53] + $average_calc_arr['temperature_data'][53];
        }

        return $average_calc_arr;
    }
}
