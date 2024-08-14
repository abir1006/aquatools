<?php

namespace App\Http\Controllers;

use App\Tools\Cod\CodArrayOutput;
use App\Tools\Modules\bPLM_EM\BPLM;
use App\Tools\Modules\bPLM_EM\EM;
use App\Tools\Modules\bPLM_EM\TilTak;
use App\Tools\Vaccine\Oppdretter;
use Illuminate\Http\Request;

class CodModelController extends Controller
{
    protected $mtbService;


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

        $lokalitet = $request['cost_of_disease_general_lokalitet_case1'];
        $generasjon = $request['cost_of_disease_general_generasjon_case1'];
        $navn = $request['cost_of_disease_general_navn_case1'];

        $antall_smolt = $request['cost_of_disease_produksjonsmodell_antall_smolt_case1'];
        $laksepris = $request['cost_of_disease_produksjonsmodell_laksepris_case1'];
        $prod_kost_budsjett = $request['cost_of_disease_produksjonsmodell_prod_kost_budsjett_case1'];
        $simulering = $request['budget_simulering'];
        $budsjett_smoltvekt_gram = $request['cost_of_disease_grunnforutsetninger_budsjett_smoltvekt_gram_case1'];
        $budsjett_slaktevekt_rund_kg = $request['cost_of_disease_grunnforutsetninger_budsjett_slaktevekt_rund_kg_case1'];
        $budsjett_ddelighet_budsjett_percentage = $request['cost_of_disease_grunnforutsetninger_budsjett_ddelighet_budsjett_percentage_case1'];
        $budsjett_snittvekt_ddfisk_kg = $request['cost_of_disease_grunnforutsetninger_budsjett_snittvekt_ddfisk_kg_case1'];
        $budsjett_bfcr = $request['cost_of_disease_grunnforutsetninger_budsjett_bfcr_case1'];
        $budsjett_forpris_snitt_kr_kg = $request['cost_of_disease_grunnforutsetninger_budsjett_forpris_snitt_kr_kg_case1'];
        $budsjett_nedklassing_prod_percentage = $request['cost_of_disease_grunnforutsetninger_budsjett_nedklassing_prod_percentage_case1'];
        $budsjett_kostnad_ddfisk_kr_per_kg = $request['cost_of_disease_grunnforutsetninger_budsjett_kostnad_ddfisk_kr_per_kg_case1'];
        $budsjett_transport_slakt_kr_per_kg_rund = $request['cost_of_disease_grunnforutsetninger_budsjett_transport_slakt_kr_per_kg_rund_case1'];
        $budsjett_slaktekost_per_kg_slyd = $request['cost_of_disease_grunnforutsetninger_budsjett_slaktekost_per_kg_slyd_case1'];
        $budsjett_redusert_pris_prod_per_kg = $request['cost_of_disease_grunnforutsetninger_budsjett_redusert_pris_prod_per_kg_case1'];
        $budsjett_omregningsfaktor_rund_slyd = $request['cost_of_disease_grunnforutsetninger_budsjett_omregningsfaktor_rund_slyd_case1'];
        $budsjett_smolt_pris_nok_per_stk = $request['cost_of_disease_grunnforutsetninger_budsjett_smolt_pris_nok_per_stk_case1'];
        $budsjett_utkast = $request['cost_of_disease_grunnforutsetninger_budsjett_utkast_case1'];
        $budsjett_cv = $request['cost_of_disease_grunnforutsetninger_budsjett_cv_case1'];

        $sjukdom_name = $request['block_sjukdom_name'];
        $sjukdom_redusert_slaktevekt_kg = $request['cost_of_disease_effekter_sjukdom_redusert_slaktevekt_kg_case1'];
        $sjukdom_kt_ddelighet_prosentpoeng = $request['cost_of_disease_effekter_sjukdom_kt_ddelighet_prosentpoeng_case1'];
        $sjukdom_vekt_pa_ddfisk = $request['cost_of_disease_effekter_sjukdom_vekt_pa_ddfisk_case1'];
        $sjukdom_kt_bfcr = $request['cost_of_disease_effekter_sjukdom_kt_bfcr_case1'];
        $sjukdom_kt_nedklassing_prod_kvalitet = $request['cost_of_disease_effekter_sjukdom_kt_nedklassing_prod_kvalitet_case1'];
        $sjukdom_utkast_poeng = $request['cost_of_disease_effekter_sjukdom_utkast_poeng_case1'];
        $sjukdom_ekstraordinre_kostnader_nok_mill = $request['cost_of_disease_effekter_sjukdom_ekstraordinre_kostnader_nok_mill_case1'];
        $sjukdom_behandlingskostnad_nok_mill = $request['cost_of_disease_effekter_sjukdom_behandlingskostnad_nok_mill_case1'];
        $sjukdom_forebygginskostnad_nok_mill = $request['cost_of_disease_effekter_sjukdom_forebygginskostnad_nok_mill_case1'];
        $prevalens_percentage = $request['cost_of_disease_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
        $sjukdom_kt_cv = $request['cost_of_disease_effekter_sjukdom_kt_cv_case1'];

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {
            if ($case_no >= 3) {
                $vaksine_tilvekst_kg_rpp = $request['cost_of_disease_effekter_av_vaksine_tilvekst_kg_rpp_case' . $case_no];
                $vaksine_tilvekst_kg_bi_effekt = $request['cost_of_disease_effekter_av_vaksine_tilvekst_kg_bi_effekt_case' . $case_no];;
                $vaksine_ddelighet_poeng_rpp = $request['cost_of_disease_effekter_av_vaksine_ddelighet_poeng_rpp_case' . $case_no];;
                $vaksine_ddelighet_poeng_bi_effekt = $request['cost_of_disease_effekter_av_vaksine_ddelighet_poeng_bi_effekt_case' . $case_no];;
                $vaksine_bfcr_enhet_rpp = $request['cost_of_disease_effekter_av_vaksine_bfcr_enhet_rpp_case' . $case_no];;
                $vaksine_bfcr_enhet_bi_effekt = $request['cost_of_disease_effekter_av_vaksine_bfcr_enhet_bi_effekt_case' . $case_no];;
                $vaksine_produksjon_poeng_rpp = $request['cost_of_disease_effekter_av_vaksine_produksjon_poeng_rpp_case' . $case_no];;
                $vaksine_produksjon_poeng_bi_effekt = $request['cost_of_disease_effekter_av_vaksine_produksjon_poeng_bi_effekt_case' . $case_no];;
                $vaksine_utkast_poeng_rpp = $request['cost_of_disease_effekter_av_vaksine_utkast_poeng_rpp_case' . $case_no];;
                $vaksine_utkast_poeng_bi_effekt = $request['cost_of_disease_effekter_av_vaksine_utkast_poeng_bi_effekt_case' . $case_no];;
                $vaksine_ekstraordinre_kostnader_rpp = $request['cost_of_disease_effekter_av_vaksine_ekstraordinre_kostnader_rpp_case' . $case_no];;
                $vaksine_behandling_rpp = $request['cost_of_disease_effekter_av_vaksine_behandling_rpp_case' . $case_no];;
                $vaksine_forebygging_rpp = $request['cost_of_disease_effekter_av_vaksine_forebygging_rpp_case' . $case_no];;
                $vaksine_kost_per_dose_nok = $request['cost_of_disease_effekter_av_vaksine_vaksine_kost_per_dose_nok_rpp_case' . $case_no];;
                $vaksine_antall_doser_per_sjsatt_smolt_rpp = $request['cost_of_disease_effekter_av_vaksine_antall_doser_per_sjsatt_smolt_rpp_case' . $case_no];;
                $vaksine_sannsynlighet_for_sjukdom_rpp = $request['cost_of_disease_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
                $vaksine_cv_rpp = $request['cost_of_disease_effekter_av_vaksine_cv_rpp_case' . $case_no];
                $vaksine_cv_bi_effekt = $request['cost_of_disease_effekter_av_vaksine_cv_bi_effekt_case' . $case_no];
            } else {
                $vaksine_tilvekst_kg_rpp = 0;
                $vaksine_tilvekst_kg_bi_effekt = 0;
                $vaksine_ddelighet_poeng_rpp = 0;
                $vaksine_ddelighet_poeng_bi_effekt = 0;
                $vaksine_bfcr_enhet_rpp = 0;
                $vaksine_bfcr_enhet_bi_effekt = 0;
                $vaksine_produksjon_poeng_rpp = 0;
                $vaksine_produksjon_poeng_bi_effekt = 0;
                $vaksine_utkast_poeng_rpp = 0;
                $vaksine_utkast_poeng_bi_effekt = 0;
                $vaksine_ekstraordinre_kostnader_rpp = 0;
                $vaksine_behandling_rpp = 0;
                $vaksine_forebygging_rpp = 0;
                $vaksine_kost_per_dose_nok = 0;
                $vaksine_antall_doser_per_sjsatt_smolt_rpp = 0;
                $vaksine_sannsynlighet_for_sjukdom_rpp = 0;
                $vaksine_cv_rpp = 0;
                $vaksine_cv_bi_effekt = 0;
            }

            $laksepris_em = $request['cost_of_disease_produksjonsmodell_laksepris_case' . $case_no];


            Oppdretter::setInputs(
                $case_no,
                $lokalitet,
                $generasjon,
                $navn,
                $antall_smolt,
                $laksepris,
                $prod_kost_budsjett,
                $simulering,
                $budsjett_smoltvekt_gram,
                $budsjett_slaktevekt_rund_kg,
                $budsjett_ddelighet_budsjett_percentage,
                $budsjett_snittvekt_ddfisk_kg,
                $budsjett_bfcr,
                $budsjett_forpris_snitt_kr_kg,
                $budsjett_nedklassing_prod_percentage,
                $budsjett_kostnad_ddfisk_kr_per_kg,
                $budsjett_transport_slakt_kr_per_kg_rund,
                $budsjett_slaktekost_per_kg_slyd,
                $budsjett_redusert_pris_prod_per_kg,
                $budsjett_omregningsfaktor_rund_slyd,
                $budsjett_smolt_pris_nok_per_stk,
                $budsjett_utkast,
                $budsjett_cv,

                $sjukdom_name,
                $sjukdom_redusert_slaktevekt_kg,
                $sjukdom_kt_ddelighet_prosentpoeng,
                $sjukdom_vekt_pa_ddfisk,
                $sjukdom_kt_bfcr,
                $sjukdom_kt_nedklassing_prod_kvalitet,
                $sjukdom_utkast_poeng,
                $sjukdom_ekstraordinre_kostnader_nok_mill,
                $sjukdom_behandlingskostnad_nok_mill,
                $sjukdom_forebygginskostnad_nok_mill,
                $prevalens_percentage,
                $sjukdom_kt_cv,

                $vaksine_tilvekst_kg_rpp,
                $vaksine_tilvekst_kg_bi_effekt,
                $vaksine_ddelighet_poeng_rpp,
                $vaksine_ddelighet_poeng_bi_effekt,
                $vaksine_bfcr_enhet_rpp,
                $vaksine_bfcr_enhet_bi_effekt,
                $vaksine_produksjon_poeng_rpp,
                $vaksine_produksjon_poeng_bi_effekt,
                $vaksine_utkast_poeng_rpp,
                $vaksine_utkast_poeng_bi_effekt,
                $vaksine_ekstraordinre_kostnader_rpp,
                $vaksine_behandling_rpp,
                $vaksine_forebygging_rpp,
                $vaksine_kost_per_dose_nok,
                $vaksine_antall_doser_per_sjsatt_smolt_rpp,
                $vaksine_sannsynlighet_for_sjukdom_rpp,
                $vaksine_cv_rpp,
                $vaksine_cv_bi_effekt,
                'Vaccine'
            );

            // Set inputs in New Economic Modules
            BPLM::setInputs(
                Oppdretter::$model,
                $budsjett_smoltvekt_gram,
                $antall_smolt,
                $prevalens_percentage,
                3600,
                3.5,
                $budsjett_slaktevekt_rund_kg,
                10,
                2,
                1.15,
                $budsjett_omregningsfaktor_rund_slyd,
                0,
                5,
                4,
                05,
                3
            );

            EM::setInputs(
                $case_no,
                $budsjett_forpris_snitt_kr_kg,
                $budsjett_smolt_pris_nok_per_stk,
                $budsjett_slaktevekt_rund_kg,
                $budsjett_kostnad_ddfisk_kr_per_kg,
                $budsjett_transport_slakt_kr_per_kg_rund,
                $budsjett_slaktekost_per_kg_slyd,
                $laksepris_em,
                0,
                $budsjett_redusert_pris_prod_per_kg,
                $prod_kost_budsjett,
                0,
                'vaccine'
            );

            TilTak::setInputs(
                $case_no,
                $vaksine_kost_per_dose_nok,
                $vaksine_antall_doser_per_sjsatt_smolt_rpp
            );

            $output['case' . $case_no] = Oppdretter::output(new CodArrayOutput());
            //logger(BPLM::testMethods());
        }

        return response()->json($output, 200);
    }
}
