<?php

namespace App\Http\Controllers;

use App\Models\Temperature;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use App\Services\TemperatureService;
use App\Http\Requests\DeleteRequest;
use Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\UnauthorizedException;

class TemperatureController extends Controller
{
    //

    protected $temperatureService;


    public function __construct(TemperatureService $temperatureService)
    {
        $this->temperatureService = $temperatureService;
        app()->setlocale(request('lang'));
    }


    public function findOne(Request $request, $id)
    {
        if (!$item = $this->temperatureService->findOne($id))
            return response()->json(
                [
                    'message' => 'No temperature found'
                ],
                401
            );


        return response()->json(
            [
                'message' => 'Success',
                'data' => $item
            ],
            201
        );
    }
    /**
     * @param Request $request
     * This method call api from barentswatch
     */
    private function getBarentWatchToken()
    {
        // First get the access token from barents watch
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://id.barentswatch.no/connect/token");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt(
            $ch,
            CURLOPT_POSTFIELDS,
            http_build_query(
                array(
                    'grant_type' => 'client_credentials',
                    'client_id' => 'nur@teknordic.com:Temp1006',
                    'client_secret' => 'abdoonnurabir',
                )
            )
        );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        curl_close($ch);

        return $response;
    }
    public function token(Request $request)
    {

        $response = json_decode($this->getBarentWatchToken());
        return response()->json(
            [
                'message' => 'Success',
                'data' => $response
            ],
            201
        );
    }
    public function fetch(Request $request)
    {
        $request_data = $request->all();
        $location_id = $request_data['location_id'];
        $start_year = $request_data['start_year'];
        $end_year = $request_data['end_year'];
        $year_wise_weekly_temperature = array();
        $avg_temperature = [];


        $response = $this->getBarentWatchToken();
        $authentication = json_decode($response);

        $barents_watch_access_token = $authentication->access_token;
        //$barents_watch_access_token = '';

        // Then fetch temperature data with access token
        try {
            $ch = curl_init();
            for ($i = $start_year; $i <= $end_year; $i = $i + 1) {
                $endpoint = "https://www.barentswatch.no/bwapi/v1/geodata/fishhealth/locality/$location_id/seatemperature/$i";

                curl_setopt($ch, CURLOPT_URL, $endpoint);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                //Set your auth headers
                curl_setopt(
                    $ch,
                    CURLOPT_HTTPHEADER,
                    array(
                        'Authorization: Bearer ' . $barents_watch_access_token
                    )
                );
                $output = curl_exec($ch);
                $output = json_decode($output, true);
                $year_wise_weekly_temperature[] = $output;
            }
            curl_close($ch);

            $avg_temperature = $this->temperatureService->_averageTemperatureCalculation($year_wise_weekly_temperature);

            // $avg_temperature['temperature_data'][1]['Avg.'] = 0;
            // $avg_temperature['temperature_data'][2]['Avg.'] = 0;
            // $avg_temperature['temperature_data'][4]['Avg.'] = null;

            // check how many items have avg valus are empty
            $noAvgValue = collect($avg_temperature['temperature_data'])->filter(function ($item) {
                return empty($item['Avg.']);
            });


            //array_sum(array_column($avg_temperature, 'Avg.'));
            if (array_sum(array_column($avg_temperature['temperature_data'], 'Avg.')) == 0 || ($noAvgValue->count() > 3)) {
                return response()->json(
                    [
                        'message' => __('temperature_data_not_found_error_message')
                    ],
                    401
                );
            }
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => __('barents_watch_invalid_access_token')
                ],
                401
            );
        }

        //add missing keys with null value
        foreach (array_keys($avg_temperature['temperature_data']) as $weekNumber) {

            if (!isset($avg_temperature['temperature_data'][$weekNumber][$start_year]))
                $avg_temperature['temperature_data'][$weekNumber][$start_year] = null;

            if (!isset($avg_temperature['temperature_data'][$weekNumber][$end_year]))
                $avg_temperature['temperature_data'][$weekNumber][$end_year] = null;

            if (!isset($avg_temperature['temperature_data'][$weekNumber]['Avg.'])) {

                $avg = null;

                $start_year_value = empty($avg_temperature['temperature_data'][$weekNumber][$start_year]) ? 0 : $avg_temperature['temperature_data'][$weekNumber][$start_year];
                $end_year_value = empty($avg_temperature['temperature_data'][$weekNumber][$end_year]) ? 0 : $avg_temperature['temperature_data'][$weekNumber][$end_year];

                if ($start_year_value && $end_year_value)
                    $avg = ($start_year_value + $end_year_value) / 2;
                elseif ($start_year_value)
                    $avg = $start_year_value;
                elseif ($end_year_value)
                    $avg = $end_year_value;

                $avg_temperature['temperature_data'][$weekNumber]['Avg.'] = $avg;
            }
        }



        return response()->json(
            [
                'message' => 'Success',
                'data' => $avg_temperature
            ],
            201
        );
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * This method save temperature template
     */
    public function store(Request $request)
    {

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $this->temperatureService->save($request->all())
            ],
            201
        );
    }

    public function update(Request $request, $id)
    {
        $data = $this->temperatureService->update($request->all(), $id);
        return response()->json(
            [
                'message' => $data ? Config::get('settings.message.saved') : config('settings.message.permission_denied'),
                'data' => $data
            ],
            201
        );
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function list(Request $request)
    {
        $getCurrentUser = Auth::user();
        if ($getCurrentUser->isAdmin()) {
            $template_list = Temperature::all();
        } else {
            $template_list = Temperature::where('user_id', $getCurrentUser->id)->get();
        }

        return response()->json($template_list, 200);
    }

    /**
     * @param DeleteRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {

        $deleted = $this->temperatureService->delete($id);

        return response()->json(
            [
                'message' => $deleted ? Config::get('settings.message.deleted') : config('settings.message.permission_denied'),
            ],
            200
        );
    }
}
