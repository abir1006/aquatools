<?php

namespace App\Http\Controllers;

use App\Tools\Feed\BackgroundCalculation;
use App\Tools\Modules\bPLM_EM\BPLM;
use App\Tools\Modules\bPLM_EM\EM;
use App\Tools\Modules\bPLM_EM\TilTak;
use App\Tools\Feed\FeedArrayOutput;
use App\Tools\Feed\Registering;
use Illuminate\Http\Request;

class FeedModelController extends Controller
{
    protected $mtbService;
    protected $vektTempArray = [];

    public function __construct()
    {
    }

    public function calculation(Request $request)
    {
        $output = [];

        if (count($request->all()) == 0) {
            print_r('Request fields not found');
            exit;
        }

        $total_cases = $request->total_cases;

        // Iterate to generate Excel output for all cases

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {
            // mapping inputs

            // General inputs
            $goal = $request['kn_for_generell_mal_case1'];
            $lokalitet = $request['kn_for_generell_lokalitet_case1'];
            $generasjon = $request['kn_for_generell_generasjon_case1'];
            $navn = $request['kn_for_generell_navn_case1'];

            // basic inputs
            $antall_utsatt = $request['kn_for_grunnforutsetning_antall_utsatt_case1'];
            $snittvekt = $request['kn_for_grunnforutsetning_snittvekt_case1'];
            $utsettsdato = $request['kn_for_grunnforutsetning_utsettsdato_case1'];
            $harvest_date = $request['kn_for_grunnforutsetning_harvest_date_case1'];
            $temperature_module = $request['temperature_module'];
            $dead_percentage = $request['kn_for_grunnforutsetning_akkumulert_ddelighet_case1'];

            // $andel_superior = $request['kn_for_grunnforutsetning_andel_superior_case1'];
            if ($case_no == 1) {
                $akkumulert_dodelighet = $request['kn_for_grunnforutsetning_akkumulert_ddelighet_case1'];
                $andel_nedklasset = $request['kn_for_grunnforutsetning_andel_nedklasset_case1'];
                $andel_vrak = $request['kn_for_grunnforutsetning_andel_vrak_case1'];
                $konv_faktor = $request['kn_for_grunnforutsetning_omregningsfaktor_slyd_case1'];
            }

            // improve/ Forbedring inputs
            if ($case_no > 1) {
                $akkumulert_dodelighet = $request['kn_for_forbedring_reduksjon_dde_prosentpoeng_case' . $case_no];
                $andel_nedklasset = $request['kn_for_forbedring_reduksjon_nedklassing_prosentpoeng_case' . $case_no];
                $andel_vrak = $request['kn_for_forbedring_reduksjon_vrak_prosentpoeng_case' . $case_no];
                $konv_faktor = $request['kn_for_forbedring_omregningsfaktor_slyd_case' . $case_no];
            }

            // improve/ Forbedring inputs
            // $reduksjon_nedklassing_prosentpoeng = $request['kn_for_forbedring_reduksjon_nedklassing_prosentpoeng_case1'];
            // $reduksjon_vrak_prosentpoeng = $request['kn_for_forbedring_reduksjon_vrak_prosentpoeng_case1'];
            // $reduksjon_dode_prosentpoeng = $request['kn_for_forbedring_reduksjon_dde_prosentpoeng_case1'];
            // $forbedring_omregningsfaktor_sloyd = $request['kn_for_forbedring_omregningsfaktor_slyd_case1'];

            // Economic inputs
            $laksepris = $request['kn_for_konomi_laksepris_case1'];
            $prodkost_per_kg_HOG_case_1 = $request['kn_for_konomi_prodkost_per_kg_hog_case_1_case1'];
            $prodkost_netto_slaktet = $request['kn_for_konomi_prodkost_netto_slaktet_case1'];
            $utsettskostnader_per_stk = $request['kn_for_konomi_utsettskostnader_per_stk_case1'];
            $slaktekostnad_rund_inkl_bronnbat = $request['kn_for_konomi_slaktekostnad_rund_inkl_brnnbat_case1'];
            $ensilasje_kr_pr_kg_dode = $request['kn_for_konomi_ensilasje_kr_pr_kg_dde_case1'];
            $redusert_pris_nedklassing = $request['kn_for_konomi_redusert_pris_nedklassing_case1'];
            $innkjring_per_kg_rundvekt = $request['kn_for_konomi_innkjring_per_kg_rundvekt_case1'];
            $slaktekostnader_per_kg_hog = $request['kn_for_konomi_slaktekostnader_per_kg_hog_case1'];
            $redusert_pris_ord = $request['kn_for_konomi_redusert_pris_ord_case1'];
            $redusert_pris_prod = $request['kn_for_konomi_redusert_pris_prod_case1'];

            // Kvalitet inputs
            $ord_percentage = $request['kn_for_kvalitet_ord_case1'];
            $ord_vekt_kg = $request['kn_for_kvalitet_ord_vekt_kg_case1'];
            $prod_percentage = $request['kn_for_kvalitet_prod_case1'];
            $prod_vekt_kg = $request['kn_for_kvalitet_prod_vekt_kg_case1'];
            $utkast_percentage = $request['kn_for_kvalitet_utkast_case1'];
            $utkast_vekt_kg = $request['kn_for_kvalitet_utkast_vekt_kg_case1'];
            $feed_table = $request['feed_table_case' . $case_no];


            $feed_count = count($feed_table);

            if ($feed_count > 1) {
                for ($i = 0; $i < $feed_count; $i++) {
                    $max_weight = $i > 0 ? $feed_table[$i - 1]['feed_max_weight'] : null;
                    $min_weight = $feed_table[$i]['feed_min_weight'];
                    $current_max_weight = $feed_table[$i]['feed_max_weight'];

                    if ($min_weight >= $current_max_weight) {
                        return response()->json(
                            [
                                'message' => 'Invalid weight range (max weight: ' . $current_max_weight . ' - min weight: ' . $min_weight . ')'
                            ],
                            401
                        );
                    }

                    if ($max_weight !== null && $min_weight <= $max_weight) {
                        return response()->json(
                            [
                                'message' => 'Invalid weight range (max weight: ' . $max_weight . ' - min weight: ' . $min_weight . ')'
                            ],
                            401
                        );
                    }

                    if ($max_weight !== null && ($min_weight - $max_weight) > 1) {
                        return response()->json(
                            [
                                'message' => 'Invalid weight range (max weight: ' . $max_weight . ' - min weight: ' . $min_weight . ')'
                            ],
                            401
                        );
                    }
                }
            }

            Registering::setInputs(
                $feed_table,
                $case_no,
                $goal,
                $lokalitet,
                $generasjon,
                $navn,
                $antall_utsatt,
                $snittvekt,
                $utsettsdato,
                $harvest_date,
                0,
                $temperature_module,
                0,
                0,
                0,
                $konv_faktor,
                0,
                0,
                0,
                0,
                $laksepris,
                $prodkost_netto_slaktet,
                $utsettskostnader_per_stk,
                $slaktekostnad_rund_inkl_bronnbat,
                $ensilasje_kr_pr_kg_dode,
                $redusert_pris_nedklassing
            );

            BackgroundCalculation::timeline();

            // Set inputs in New Economic Modules
            BPLM::setInputs(
                'Feed',
                $snittvekt,
                $antall_utsatt,
                100,
                3600,
                BackgroundCalculation::vf3(),
                BackgroundCalculation::slakteVekt(),
                BackgroundCalculation::deadPercentage(),
                BackgroundCalculation::avgDeadVektKg(),
                BackgroundCalculation::bfcr(),
                $konv_faktor,
                $ord_percentage, // Kvalitet inputs started
                $ord_vekt_kg,
                $andel_nedklasset,
                $prod_vekt_kg,
                $andel_vrak,
                $utkast_vekt_kg
            );
            EM::setInputs(
                $case_no,
                BackgroundCalculation::avgFeedPrisKg(),
                14,
                5.3,
                $ensilasje_kr_pr_kg_dode,
                $innkjring_per_kg_rundvekt,
                $slaktekostnader_per_kg_hog,
                $laksepris,
                $redusert_pris_ord,
                $redusert_pris_prod,
                $prodkost_per_kg_HOG_case_1,
                BackgroundCalculation::totalForkost()
            );

            TilTak::setInputs($case_no);

            $this->vektTempArray['case' . $case_no] = BackgroundCalculation::vektutvikling();

            $output['case' . $case_no] = Registering::output(new FeedArrayOutput());
        }

        $this->rearrangeVektutviklingGraphData($total_cases, $output);

        return response()->json($output, 200);
    }

    public function rearrangeVektutviklingGraphData($total_cases, &$output)
    {
        //reorder vektutvikling array
        $vektutviklingArray = [];
        foreach ($output as $case => $data) {
            $vektutviklingArray[$case] = $data['vektutvikling'];
        }

        $lastValues = collect($vektutviklingArray)->map(function ($item) {
            return array_key_last($item);
        });

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {

            $case = 'case' . $case_no;

            $item = $vektutviklingArray[$case];
            $vektTmp = $this->vektTempArray[$case];

            foreach ($lastValues as $value) {

                $feedLastDate  = array_key_last($item);
                $dt1 = str_replace('/', '-', $value);
                $dt2 = str_replace('/', '-', $feedLastDate);

                if (!in_array($value, $item) && (strtotime($dt1) <= strtotime($dt2)))
                    $vektutviklingArray[$case][$value] = $vektTmp[$value];
            }


            //sort array according to date
            uksort($vektutviklingArray[$case], function ($dt1, $dt2) {
                $dt1 = str_replace('/', '-', $dt1);
                $dt2 = str_replace('/', '-', $dt2);

                return strtotime($dt1) - strtotime($dt2);
            });

            // update output array
            $output[$case]['vektutvikling'] = $vektutviklingArray[$case];
        }



        return $vektutviklingArray;
    }

    public function testAllClasses()
    {
        $output = array(
            'bPLM' => Registering::testBPLM(),
            'EM' => Registering::testEM()
        );
        return response()->json($output, 200);
    }
}
