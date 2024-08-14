<?php

namespace App\Http\Controllers;

use App\Tools\Modules\bPLM_EM\BPLM;
use App\Tools\Modules\bPLM_EM\EM;
use App\Tools\Modules\bPLM_EM\TilTak;
use App\Tools\Genetics\Oppdretter;
use App\Tools\Genetics\GeneticsArrayOutput;
use Illuminate\Http\Request;

class GeneticsModelController extends Controller
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

        //production model
        $antall_smolt = $request['genetics_produksjonsmodell_antall_smolt_case1'];
        $prod_kost = $request['genetics_produksjonsmodell_prod_kost_case1'];

        //Grunnforutsetninger
        $simulering = $request['case1_name'];
        $smoltvekt_gram = $request['genetics_grunnforutsetninger_smoltvekt_gram_case1'];
        $dgngrader = $request['genetics_grunnforutsetninger_dgngrader_utsett_slakt_case1'];
        $ddelighet = $request['genetics_grunnforutsetninger_ddelighet_case1'];
        $snittvekt_ddfisk_kg = $request['genetics_grunnforutsetninger_snittvekt_ddfisk_kg_case1'];
        $bfcr = $request['genetics_grunnforutsetninger_bfcr_case1'];
        $smolt_pris_nok_per_stk = $request['genetics_grunnforutsetninger_smolt_pris_nok_per_stk_case1'];
        $forpris_snitt_krkg = $request['genetics_grunnforutsetninger_forpris_snitt_krkg_case1'];
        $rundvekt_slakt_kg = $request['genetics_grunnforutsetninger_rundvekt_slakt_kg_case1'];
        $nedklassing_prod = $request['genetics_grunnforutsetninger_nedklassing_prod_case1'];
        $transport_slakt_kr_per_kg_rund = $request['genetics_grunnforutsetninger_transport_slakt_kr_per_kg_rund_case1'];
        $slaktekost_per_kg_slyd = $request['genetics_grunnforutsetninger_slaktekost_per_kg_slyd_case1'];
        $redusert_pris_prod_per_kg = $request['genetics_grunnforutsetninger_redusert_pris_prod_per_kg_case1'];
        $redusert_pris_ord_per_kg = $request['genetics_grunnforutsetninger_redusert_pris_ord_per_kg_case1'];
        $omregningsfaktor_rund_slyd = $request['genetics_grunnforutsetninger_omregningsfaktor_rund_slyd_case1'];
        $kostnad_ddfisk_kr_per_kg = $request['genetics_grunnforutsetninger_kostnad_ddfisk_kr_per_kg_case1'];
        $antall_rogn_per_smolt = $request['genetics_grunnforutsetninger_antall_rogn_per_smolt_case1'];

        $nedklassing_ord = $request['genetics_grunnforutsetninger_ord_case1'];

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {
            //forbedering produksjon
            $simulering = $request['name_case' . $case_no];
            $smoltvekt_gram = $case_no == 1 ? $smoltvekt_gram : $request['genetics_effekter_genetikk_k_tilvekst_gram_rund_case' . $case_no];
            $ddelighet = $case_no == 1 ? $ddelighet : $request['genetics_effekter_genetikk_redusert_dde_case' . $case_no];
            $snittvekt_ddfisk_kg = $case_no == 1 ? $snittvekt_ddfisk_kg : $request['genetics_effekter_genetikk_redusert_dde_vekt_kg_case' . $case_no];
            $rundvekt_slakt_kg = $case_no == 1 ? $rundvekt_slakt_kg : $request['genetics_effekter_genetikk_k_tilvekst_gram_rund_case'. $case_no] / 1000;
            $bfcr = $case_no == 1 ? $bfcr : $request['genetics_effekter_genetikk_redusert_bfcr_case' . $case_no];
            $nedklassing_prod = $case_no == 1 ? $nedklassing_prod : $request['genetics_effekter_genetikk_nedklassing_prod_case' . $case_no];
            $redusert_pris_prod_per_kg = $case_no == 1 ? $redusert_pris_prod_per_kg : $request['genetics_effekter_genetikk_reduksjon_prodkost_per_kg_case' . $case_no];
            $redusert_pris_ord_per_kg = $case_no == 1 ? $redusert_pris_ord_per_kg : $request['genetics_effekter_genetikk_redusert_pris_ord_per_kg_case' . $case_no];

            //$dgngrader = $case_no == 1 ? $dgngrader : 0;

            //kvalitet
            $kvalitet_ord = $case_no == 1 ? $nedklassing_ord : $request['genetics_effekter_genetikk_redusert_ord_case' . $case_no];
            $kvalitet_prod = $case_no == 1 ? $nedklassing_prod : $request['genetics_effekter_genetikk_nedklassing_prod_case' . $case_no];
            $kvalitet_utkast = $request['genetics_kvalitet_utkast_case' . $case_no];

            //Tiltak
            $tiltak_investeringskost_nok_1000 = $request['genetics_tiltak_investeringskost_nok_1000_case' . $case_no];
            $tiltak_avskrivingstid_ar = $request['genetics_tiltak_avskrivingstid_ar_case' . $case_no];
            $tiltak_restverdi = $request['genetics_tiltak_restverdi_case' . $case_no];
            $tiltak_rente = $request['genetics_tiltak_rente_case' . $case_no];
            $tiltak_tiltak_nok_1000_per_ar = $request['genetics_tiltak_tiltak_nok_1000_per_ar_case' . $case_no];
            $tiltak_ekstraordinre_kostnader_nok_1000_per_ar = $request['genetics_tiltak_ekstraordinre_kostnader_nok_1000_per_ar_case' . $case_no];
            $tiltak_merpris_for_nok_kg = $request['genetics_tiltak_merpris_for_nok_kg_case' . $case_no];

            $laksepris = $request['genetics_produksjonsmodell_laksepris_case' . $case_no];


            Oppdretter::setInputs(
                $case_no,
                '',
                '',
                '',
                $antall_smolt,
                $laksepris,
                $prod_kost,
                $simulering,
                $smoltvekt_gram,
                0,
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
                $antall_rogn_per_smolt,
                '',
                '',
                '',
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
                0,
                $slaktekost_per_kg_slyd,
                $ddelighet,
                $snittvekt_ddfisk_kg,
                $bfcr,
                $omregningsfaktor_rund_slyd,
                $kvalitet_ord,
                5,
                $kvalitet_prod,
                $rundvekt_slakt_kg,
                $kvalitet_utkast,
                0,
                $case_no
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
                'Genetics'
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

            $output['case' . $case_no] = Oppdretter::output(new GeneticsArrayOutput());
        }

        return response()->json($output, 200);
    }
}
