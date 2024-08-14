<?php

namespace App\Tools\Vaccine;

class Calculation
{
    public $request;
    public $output;

    public function __construct($request)
    {
        $this->request = $request;
        $this->process();
    }

    public function process()
    {
        $request = $this->request->all();

        for ($case_no = 1; $case_no <= $this->request->total_cases; $case_no++) {



            $lokalitet = $request['vaksinering_general_lokalitet_case1'];
            $generasjon = $request['vaksinering_general_generasjon_case1'];
            $navn = $request['vaksinering_general_navn_case1'];


            $antall_smolt = $request['vaksinering_produksjonsmodell_antall_smolt_case1'];
            $laksepris = $request['vaksinering_produksjonsmodell_laksepris_case1'];

            $simulering = $request['budget_simulering'];
            $budsjett_smoltvekt_gram = $request['vaksinering_grunnforutsetninger_budsjett_smoltvekt_gram_case1'];
            $budsjett_slaktevekt_rund_kg = $request['vaksinering_grunnforutsetninger_budsjett_slaktevekt_rund_kg_case1'];
            $budsjett_ddelighet_budsjett_percentage = $request['vaksinering_grunnforutsetninger_budsjett_ddelighet_budsjett_percentage_case1'];
            $budsjett_snittvekt_ddfisk_kg = $request['vaksinering_grunnforutsetninger_budsjett_snittvekt_ddfisk_kg_case1'];
            $budsjett_bfcr = $request['vaksinering_grunnforutsetninger_budsjett_bfcr_case1'];
            $budsjett_forpris_snitt_kr_kg = $request['vaksinering_grunnforutsetninger_budsjett_forpris_snitt_kr_kg_case1'];
            $budsjett_nedklassing_prod_percentage = $request['vaksinering_grunnforutsetninger_budsjett_nedklassing_prod_percentage_case1'];
            $budsjett_kostnad_ddfisk_kr_per_kg = $request['vaksinering_grunnforutsetninger_budsjett_kostnad_ddfisk_kr_per_kg_case1'];
            $budsjett_transport_slakt_kr_per_kg_rund = $request['vaksinering_grunnforutsetninger_budsjett_transport_slakt_kr_per_kg_rund_case1'];
            $budsjett_slaktekost_per_kg_slyd = $request['vaksinering_grunnforutsetninger_budsjett_slaktekost_per_kg_slyd_case1'];
            $budsjett_redusert_pris_prod_per_kg = $request['vaksinering_grunnforutsetninger_budsjett_redusert_pris_prod_per_kg_case1'];
            $budsjett_omregningsfaktor_rund_slyd = $request['vaksinering_grunnforutsetninger_budsjett_omregningsfaktor_rund_slyd_case1'];

            $sjukdom_name = $request['block_sjukdom_name'];
            $sjukdom_redusert_slaktevekt_kg = $request['vaksinering_effekter_sjukdom_redusert_slaktevekt_kg_case1'];
            $sjukdom_kt_ddelighet_prosentpoeng = $request['vaksinering_effekter_sjukdom_kt_ddelighet_prosentpoeng_case1'];
            $sjukdom_vekt_pa_ddfisk = $request['vaksinering_effekter_sjukdom_vekt_pa_ddfisk_case1'];
            $sjukdom_kt_bfcr = $request['vaksinering_effekter_sjukdom_kt_bfcr_case1'];
            $sjukdom_kt_nedklassing_prod_kvalitet = $request['vaksinering_effekter_sjukdom_kt_nedklassing_prod_kvalitet_case1'];
            $sjukdom_utkast_poeng = $request['vaksinering_effekter_sjukdom_utkast_poeng_case1'];
            $sjukdom_ekstraordinre_kostnader_nok_mill = $request['vaksinering_effekter_sjukdom_ekstraordinre_kostnader_nok_mill_case1'];
            $sjukdom_behandlingskostnad_nok_mill = $request['vaksinering_effekter_sjukdom_behandlingskostnad_nok_mill_case1'];
            $sjukdom_forebygginskostnad_nok_mill = $request['vaksinering_effekter_sjukdom_forebygginskostnad_nok_mill_case1'];

            if ($case_no >= 3) {
                $vaksine_tilvekst_kg_rpp = $request['vaksinering_effekter_av_vaksine_tilvekst_kg_rpp_case' . $case_no];
                $vaksine_tilvekst_kg_bi_effekt = $request['vaksinering_effekter_av_vaksine_tilvekst_kg_bi_effekt_case' . $case_no];;
                $vaksine_ddelighet_poeng_rpp = $request['vaksinering_effekter_av_vaksine_ddelighet_poeng_rpp_case' . $case_no];;
                $vaksine_ddelighet_poeng_bi_effekt = $request['vaksinering_effekter_av_vaksine_ddelighet_poeng_bi_effekt_case' . $case_no];;
                $vaksine_bfcr_enhet_rpp = $request['vaksinering_effekter_av_vaksine_bfcr_enhet_rpp_case' . $case_no];;
                $vaksine_bfcr_enhet_bi_effekt = $request['vaksinering_effekter_av_vaksine_bfcr_enhet_bi_effekt_case' . $case_no];;
                $vaksine_produksjon_poeng_rpp = $request['vaksinering_effekter_av_vaksine_produksjon_poeng_rpp_case' . $case_no];;
                $vaksine_produksjon_poeng_bi_effekt = $request['vaksinering_effekter_av_vaksine_produksjon_poeng_bi_effekt_case' . $case_no];;
                $vaksine_utkast_poeng_rpp = $request['vaksinering_effekter_av_vaksine_utkast_poeng_rpp_case' . $case_no];;
                $vaksine_utkast_poeng_bi_effekt = $request['vaksinering_effekter_av_vaksine_utkast_poeng_bi_effekt_case' . $case_no];;
                $vaksine_ekstraordinre_kostnader_rpp = $request['vaksinering_effekter_av_vaksine_ekstraordinre_kostnader_rpp_case' . $case_no];;
                $vaksine_behandling_rpp = $request['vaksinering_effekter_av_vaksine_behandling_rpp_case' . $case_no];;
                $vaksine_forebygging_rpp = $request['vaksinering_effekter_av_vaksine_forebygging_rpp_case' . $case_no];;
                $vaksine_kost_per_dose_nok = $request['vaksinering_effekter_av_vaksine_vaksine_kost_per_dose_nok_rpp_case' . $case_no];;
                $vaksine_antall_doser_per_sjsatt_smolt_rpp = $request['vaksinering_effekter_av_vaksine_antall_doser_per_sjsatt_smolt_rpp_case' . $case_no];;
                $vaksine_sannsynlighet_for_sjukdom_rpp = $request['vaksinering_effekter_av_vaksine_sannsynlighet_for_sjukdom_rpp_case' . $case_no];;
            }


            Oppdretter::setInputs(
                $case_no,
                $lokalitet,
                $generasjon,
                $navn,
                $antall_smolt,
                $laksepris,
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
                $vaksine_sannsynlighet_for_sjukdom_rpp
            );
        }
    }
    public static function generateOutput()
    {
        # code...
    }
}
