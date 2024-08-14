<?php

namespace App\Http\Controllers;

use App\Http\Requests\MTBBlockListRequest;
use App\Services\MTBService;
use App\Tools\Modules\Price\ForwardData;
use App\Tools\Modules\Price\HistoriskData;
use App\Tools\Modules\Price\PriceModule;
use App\Tools\MTB\Snittvekt;
use Illuminate\Http\Request;
use App\Tools\MTB\Oppdretter;
use App\Tools\MTB\MTBArrayOutput;

class MTBController extends Controller
{
    protected $mtbService;


    public function __construct(MTBService $mtbService)
    {
        $this->mtbService = $mtbService;
    }

    public function blockList(MTBBlockListRequest $request)
    {
        $modules = $this->mtbService->blockList($request->all());

        return response()->json($modules, 200);
    }

    public function excelCalculation(Request $request)
    {
        $output = [];

        if (count($request->all()) == 0) {
            print_r('Request fields not found');
            exit;
        }

        $total_cases = $request->total_cases;

        // Iterate to generate Excel output for all cases

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {
            // these 3 fields is always case 1
            $mtb_selskap_mtb_per_kons = $request['mtb_selskap_mtb_per_kons_case1'];
            $mtb_selskap_antall_konsesjoner = $request['mtb_selskap_antall_konsesjoner_case1'];
            $mtb_selskap_faste_kost_nok_mill_per_kons = $request['mtb_selskap_faste_kost_nok_mill_per_kons_case1'];
            $mtb_selskap_konvetrering_rund_til_hog = $request['mtb_selskap_konvetrering_rund_til_hog_case1'];

            $mtb_produksjon_mtb_utnytting = $request['mtb_produksjon_mtb_utnytting_case' . $case_no];
            $mtb_produksjon_snitttemp = $request['mtb_produksjon_snitttemp_case' . $case_no];
            $mtb_produksjon_smoltvekt_gram = $request['mtb_produksjon_smoltvekt_gram_case' . $case_no];
            $mtb_produksjon_slaktevekt_rund_gram = $request['mtb_produksjon_slaktevekt_rund_gram_case' . $case_no];

            $mtb_biologi_svinn_maned = $request['mtb_biologi_svinn_maned_case' . $case_no];
            $mtb_biologi_snittvekt_ddfisk_av_snittvekt = $request['mtb_biologi_snittvekt_ddfisk_av_snittvekt_case' . $case_no];
            $mtb_biologi_fcrb = $request['mtb_biologi_fcrb_case' . $case_no];
            $mtb_biologi_vf3 = $request['mtb_biologi_vf3_case' . $case_no];
            $mtb_biologi_cv = $request['mtb_biologi_cv_case' . $case_no];

            $mtb_kvalitet_prod_kvalitet = $request['mtb_kvalitet_prod_kvalitet_case' . $case_no];
            $mtb_kvalitet_utkast = $request['mtb_kvalitet_utkast_case' . $case_no];

            $mtb_priser_forpris = $request['mtb_priser_forpris_case' . $case_no];
            $mtb_priser_smoltpris_per_fisk = $request['mtb_priser_smoltpris_per_fisk_case' . $case_no];
            $mtb_priser_smoltpris_per_kg = $request['mtb_priser_smoltpris_per_kg_case' . $case_no];
            $mtb_priser_innkjring_og_slakt_per_kg_hog = $request['mtb_priser_innkjring_og_slakt_per_kg_hog_case' . $case_no];
            $mtb_priser_ddfisk_per_kg = $request['mtb_priser_ddfisk_per_kg_case1'];

            $mtb_priser_prod_kvalitet_redusert_pris_per_kg = $request['mtb_priser_prod_kvalitet_redusert_pris_per_kg_case' . $case_no];
            $mtb_priser_laksepris = $request['mtb_priser_laksepris_case' . $case_no];
            $mtb_priser_variabel_drifstkost_per_kons_dag_nok = $request['mtb_priser_variabel_drifstkost_per_kons_dag_nok_case' . $case_no];

            $mtb_investering_investeringskost_nok_1000 = $request['mtb_investering_investeringskost_nok_1000_case' . $case_no];
            $mtb_investering_avskrivingstid = $request['mtb_investering_avskrivingstid_case' . $case_no];
            $mtb_investering_restverdi = $request['mtb_investering_restverdi_case' . $case_no];
            $mtb_investering_rente = $request['mtb_investering_rente_per_ar_case' . $case_no];
            $mtb_investering_tiltak_nok_1000_per_ar = $request['mtb_investering_tiltak_nok_1000_per_ar_case' . $case_no];
            $mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar = $request['mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar_case' . $case_no];
            $mtb_investering_merpris_for_nok_kg = $request['mtb_investering_merpris_for_nok_kg_case' . $case_no];
            $mtb_cv = $request['mtb_investering_merpris_for_nok_kg_case' . $case_no];

            Oppdretter::setInputs(
                $case_no,
                $mtb_selskap_mtb_per_kons,
                $mtb_selskap_antall_konsesjoner,
                $mtb_selskap_faste_kost_nok_mill_per_kons,
                $mtb_selskap_konvetrering_rund_til_hog,
                $mtb_produksjon_mtb_utnytting,
                $mtb_produksjon_snitttemp,
                $mtb_produksjon_smoltvekt_gram,
                $mtb_produksjon_slaktevekt_rund_gram,
                $mtb_biologi_svinn_maned,
                $mtb_biologi_fcrb,
                $mtb_biologi_vf3,
                $mtb_biologi_cv,
                $mtb_kvalitet_prod_kvalitet,
                $mtb_kvalitet_utkast,
                $mtb_priser_forpris,
                $mtb_priser_smoltpris_per_fisk,
                $mtb_priser_smoltpris_per_kg,
                $mtb_priser_innkjring_og_slakt_per_kg_hog,
                $mtb_priser_ddfisk_per_kg,
                $mtb_biologi_snittvekt_ddfisk_av_snittvekt,
                $mtb_priser_prod_kvalitet_redusert_pris_per_kg,
                $mtb_priser_laksepris,
                $mtb_priser_variabel_drifstkost_per_kons_dag_nok,
                $mtb_investering_investeringskost_nok_1000,
                $mtb_investering_avskrivingstid,
                $mtb_investering_restverdi,
                $mtb_investering_rente,
                $mtb_investering_tiltak_nok_1000_per_ar,
                $mtb_investering_ekstraordinre_kostnader_nok_1000_per_ar,
                $mtb_investering_merpris_for_nok_kg
            );

            // set Snittvekt data just after set inputs
            Snittvekt::biomasseSumIfs();
            Snittvekt::biomasseSnittSumIfs();


            $output['case' . $case_no] = Oppdretter::calculateOutput(new MTBArrayOutput());
        }

        //exit;

        return response()->json($output, 200);
    }

    public function priceModuleExcelCalculation(Request $request)
    {
        $output = [];

        if (count($request->all()) == 0) {
            print_r('Request fields not found');
            exit;
        }

        HistoriskData::setSalmonNasdaqHistoryData();
        ForwardData::setFishpoolForwardData();
        //logger(array_slice($result, -1, 1, true));

        $total_cases = $request->total_cases;

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {
            $price_type = $request['price_type'];
            $uke_start = $request['historic_period_start'];
            $uke_slutt = $request['historic_period_end'];
            $month_start = $request['forward_period_start'];
            $month_end = $request['forward_period_end'];

            $snittvekt = $request['price_module_snittvekt_case' . $case_no];
            $cv = $request['price_module_cv_case' . $case_no];
            $lakse_pris_percentage = $request['lakse_pris_percentage_case' . $case_no] == '' ? 100 : $request['lakse_pris_percentage_case' . $case_no];

            PriceModule::setInputs(
                $case_no,
                $price_type,
                $uke_start,
                $uke_slutt,
                $month_start,
                $month_end,
                $snittvekt,
                $cv,
                $lakse_pris_percentage
            );

            $output['case' . $case_no] = PriceModule::calculateOutput(new MTBArrayOutput());
        }

        return response()->json($output, 200);
    }


    public function priceModuleExcelCalculationTest(Request $request)
    {
        $output = [];

        if (count($request->all()) == 0) {
            print_r('Request fields not found');
            exit;
        }

        HistoriskData::setSalmonNasdaqHistoryData();
        ForwardData::setFishpoolForwardData();

        $total_cases = $request->total_cases;

        for ($case_no = 1; $case_no <= $total_cases; $case_no++) {
            $price_type = $request['price_type'];
            $uke_start = $request['historic_period_start'];
            $uke_slutt = $request['historic_period_end'];
            $month_start = $request['forward_period_start'];
            $month_end = $request['forward_period_end'];

            $snittvekt = $request['price_module_snittvekt_case' . $case_no];
            $cv = $request['price_module_cv_case' . $case_no];

            PriceModule::setInputs(
                $case_no,
                $price_type,

                $uke_start,
                $uke_slutt,
                $month_start,
                $month_end,

                $snittvekt,
                $cv
            );

            $output['case' . $case_no] = PriceModule::calculateOutputTest(new MTBArrayOutput());
        }

        return response()->json($output, 200);
    }

    //    public function downloadNasdaqExcels()
    //    {
    //        $save_path = app_path() . '/Tools/Modules/Price/salmonprice/';
    //
    //        $url = 'https://salmonprice.nasdaqomxtrader.com/public/report;jsessionid=01D67B94A78581A58ACA7F004DB72C79?1-1.ILinkListener-loginMenu-downloadIndexHistoryLink=';
    //
    //
    //        file_put_contents($save_path.'newExcel.xls', file_get_contents($url));
    //
    //        print_r('done');
    //        exit;
    //    }


}
