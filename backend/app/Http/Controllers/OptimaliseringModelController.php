<?php

namespace App\Http\Controllers;

use App\Tools\Modules\bPLM_EM\BPLM;
use App\Tools\Modules\bPLM_EM\EM;
use App\Tools\Modules\bPLM_EM\TilTak;
use App\Tools\Optimization\Oppdretter;
use App\Tools\Optimization\OptimizationArrayOutput;
use Illuminate\Http\Request;

class OptimaliseringModelController extends Controller
{

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

        //generel
        $lokalitet = $request['optimalisering_general_lokalitet_case1'];
        $generasjon = $request['optimalisering_general_generasjon_case1'];
        $navn = $request['optimalisering_general_navn_case1'];

        //production model
        $antall_smolt = $request['optimalisering_produksjonsmodell_antall_smolt_case1'];
        $prod_kost = $request['optimalisering_produksjonsmodell_prod_kost_case1'];

        //Grunnforutsetninger
        $simulering = $request['case1_name'];
        $smoltvekt_gram = $request['optimalisering_grunnforutsetninger_smoltvekt_gram_case1'];
        $vf3 = $request['optimalisering_grunnforutsetninger_vf3_historisk_case1'];
        $dgngrader = $request['optimalisering_grunnforutsetninger_dgngrader_utsett_slakt_case1'];
        $ddelighet = $request['optimalisering_grunnforutsetninger_ddelighet_case1'];
        $snittvekt_ddfisk_kg = $request['optimalisering_grunnforutsetninger_snittvekt_ddfisk_kg_case1'];
        $bfcr = $request['optimalisering_grunnforutsetninger_bfcr_case1'];
        $smolt_pris_nok_per_stk = $request['optimalisering_grunnforutsetninger_smolt_pris_nok_per_stk_case1'];
        $forpris_snitt_krkg = $request['optimalisering_grunnforutsetninger_forpris_snitt_krkg_case1'];
        $nedklassing_prod = $request['optimalisering_grunnforutsetninger_nedklassing_prod_case1'];
        $transport_slakt_kr_per_kg_rund = $request['optimalisering_grunnforutsetninger_transport_slakt_kr_per_kg_rund_case1'];
        $slaktekost_per_kg_slyd = $request['optimalisering_grunnforutsetninger_slaktekost_per_kg_slyd_case1'];
        $redusert_pris_prod_per_kg = $request['optimalisering_grunnforutsetninger_redusert_pris_prod_per_kg_case1'];
        $redusert_pris_ord_per_kg = $request['optimalisering_grunnforutsetninger_redusert_pris_ord_per_kg_case1'];
        $omregningsfaktor_rund_slyd = $request['optimalisering_grunnforutsetninger_omregningsfaktor_rund_slyd_case1'];
        $kostnad_ddfisk_kr_per_kg = $request['optimalisering_grunnforutsetninger_kostnad_ddfisk_kr_per_kg_case1'];
        $kvalitet_ord = $request['optimalisering_grunnforutsetninger_ord_case1'];
        $kvalitet_utkast = $request['optimalisering_grunnforutsetninger_discard_percentage_case1'];
        $basic_cv = $request['optimalisering_grunnforutsetninger_cv_case1'];

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {
            //forbedering produksjon
            $simulering = $request['name_case' . $case_no];
            $smoltvekt_gram = $case_no == 1 ? $smoltvekt_gram : $request['optimalisering_effekter_forbedring_produksjon_smoltvekt_gram_case' . $case_no];
            $vf3 = $case_no == 1 ? $vf3 : $request['optimalisering_effekter_forbedring_produksjon_tilvekst_vf3_case' . $case_no];
            $ddelighet = $case_no == 1 ? $ddelighet : $request['optimalisering_effekter_forbedring_produksjon_redusert_dde_prosentpoeng_case' . $case_no];
            $snittvekt_ddfisk_kg = $case_no == 1 ? $snittvekt_ddfisk_kg : $request['optimalisering_effekter_forbedring_produksjon_redusert_dde_vekt_kg_case' . $case_no];
            $bfcr = $case_no == 1 ? $bfcr : $request['optimalisering_effekter_forbedring_produksjon_redusert_bfcr_enhet_case' . $case_no];
            $nedklassing_prod = $case_no == 1 ? $nedklassing_prod : $request['optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng_case' . $case_no];

            $improved_cv = $case_no == 1 ? $basic_cv : $request['optimalisering_effekter_forbedring_produksjon_cv_case' . $case_no];

            // $redusert_pris_prod_per_kg = $case_no == 1 ? $redusert_pris_prod_per_kg : $request['optimalisering_effekter_forbedring_produksjon_reduksjon_prodkost_per_kg_case' . $case_no];
            // $redusert_pris_ord_per_kg = $case_no == 1 ? $redusert_pris_ord_per_kg : $request['optimalisering_effekter_forbedring_produksjon_redusert_pris_ord_per_kg_case' . $case_no];
            //$dgngrader = $case_no == 1 ? $dgngrader : 0;

            //kvalitet
            $kvalitet_ord = $case_no == 1 ? $kvalitet_ord : $request['optimalisering_effekter_forbedring_produksjon_redusert_ord_case' . $case_no];
            $kvalitet_prod = $case_no == 1 ? $nedklassing_prod : $request['optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng_case' . $case_no];
            $kvalitet_utkast = $case_no == 1 ? $kvalitet_utkast : $request['optimalisering_effekter_forbedring_produksjon_discard_percentage_case' . $case_no];

            //Tiltak
            $tiltak_investeringskost_nok_1000 = $request['optimalisering_tiltak_investeringskost_nok_1000_case' . $case_no];
            $tiltak_avskrivingstid_ar = $request['optimalisering_tiltak_avskrivingstid_ar_case' . $case_no];
            $tiltak_restverdi = $request['optimalisering_tiltak_restverdi_case' . $case_no];
            $tiltak_rente = $request['optimalisering_tiltak_rente_case' . $case_no];
            $tiltak_tiltak_nok_1000_per_ar = $request['optimalisering_tiltak_tiltak_nok_1000_per_ar_case' . $case_no];
            $tiltak_ekstraordinre_kostnader_nok_1000_per_ar = $request['optimalisering_tiltak_ekstraordinre_kostnader_nok_1000_per_ar_case' . $case_no];
            $tiltak_merpris_for_nok_kg = $request['optimalisering_tiltak_merpris_for_nok_kg_case' . $case_no];

            $laksepris = $request['optimalisering_produksjonsmodell_laksepris_case' . $case_no];




            Oppdretter::setInputs(
                $case_no,
                $lokalitet,
                $generasjon,
                $navn,
                $antall_smolt,
                $laksepris,
                $prod_kost,
                $simulering,
                $smoltvekt_gram,
                $vf3,
                $dgngrader,
                $ddelighet,
                $snittvekt_ddfisk_kg,
                $bfcr,
                $smolt_pris_nok_per_stk,
                $forpris_snitt_krkg,
                $nedklassing_prod,
                $transport_slakt_kr_per_kg_rund,
                $slaktekost_per_kg_slyd,
                $redusert_pris_prod_per_kg,
                $omregningsfaktor_rund_slyd,

                $kvalitet_ord,
                $kvalitet_prod,
                $kvalitet_utkast,
                $tiltak_investeringskost_nok_1000,
                $tiltak_avskrivingstid_ar,
                $tiltak_restverdi,
                $tiltak_rente,
                $tiltak_tiltak_nok_1000_per_ar,
                $tiltak_ekstraordinre_kostnader_nok_1000_per_ar
            );

            // Set inputs in New Economic Modules
            BPLM::setInputs(
                Oppdretter::$model,
                $smoltvekt_gram,
                $antall_smolt,
                100,
                $dgngrader,
                $vf3,
                $slaktekost_per_kg_slyd,
                $ddelighet,
                $snittvekt_ddfisk_kg,
                $bfcr,
                0.86,
                $kvalitet_ord,
                5,
                $nedklassing_prod,
                4,
                $kvalitet_utkast,
                0,
                $case_no,
                $basic_cv,
                $improved_cv
            );

            EM::setInputs(
                $case_no,
                $forpris_snitt_krkg,
                $smolt_pris_nok_per_stk,
                BPLM::slaktevektRundSup(),
                $kostnad_ddfisk_kr_per_kg,
                $transport_slakt_kr_per_kg_rund,
                $slaktekost_per_kg_slyd,
                $laksepris,
                $redusert_pris_ord_per_kg,
                $redusert_pris_prod_per_kg,
                $prod_kost,
                0,
                'Optimization'
            );

            TilTak::setInputs(
                $case_no,
                0,
                0,
                $tiltak_investeringskost_nok_1000,
                $tiltak_avskrivingstid_ar,
                $tiltak_restverdi,
                $tiltak_rente,
                $tiltak_tiltak_nok_1000_per_ar,
                $tiltak_ekstraordinre_kostnader_nok_1000_per_ar,
                $tiltak_merpris_for_nok_kg
            );

            $output['case' . $case_no] = Oppdretter::output(new OptimizationArrayOutput());
        }

        return response()->json($output, 200);
    }
}
