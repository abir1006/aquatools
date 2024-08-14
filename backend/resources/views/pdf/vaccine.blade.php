<?php use App\Http\Controllers\PDFController;?>

<body style="background-color: #f6f6f6">
    @php
    $headerData =
    [
    'site'=>$inputs['vaksinering_general_lokalitet_case1'],
    'generation'=>$inputs['vaksinering_general_generasjon_case1'],
    'name'=>$inputs['vaksinering_general_navn_case1'],
    ];
    @endphp

    @include('pdf.header',$headerData)
    @include('pdf.footer')

    <div id="pdf_frame">
        <div class="pdf_body">


            <?php
            $caseStr = '';
            $dataStr1 = '';
            $dataStr2 = '';
            $dataStr3 = '';
            $dataStr4 = '';
            $dataStr5 = '';
            $dataStr6 = '';
            $dataStr7 = '';
            $dataStr8 = '';
            $dataStr9 = '';
            $biologiskeTapStr = '';
            $okteUtgifterStr = '';
            $labelTrans = ['budget', 'disease', 'vacc_a', 'vacc_b', 'vacc_c'];

            $baseValue1 = $graphBaseValue['slaktevektRund'];
            $baseValue2 = $graphBaseValue['tonnSloyd'];
            $baseValue3 = $graphBaseValue['efcr'];
            $baseValue4 = $graphBaseValue['prodkostPerKg'];
            $baseValue5 = $graphBaseValue['driftsResultat'];
            $baseValue6 = $graphBaseValue['lakseprisGjennomsnittKrPerkg'];
            $baseValue9 = $graphBaseValue['deadPercentage'];
            //$baseValue7 = $graphBaseValue['lakseprisGjennomsnittKrPerkg'];


            $inputs['block_sjukdom_name'] = isset($inputs['block_sjukdom_name'])?$inputs['block_sjukdom_name']:'SAV3';
            $inputs['budget_name'] = isset($inputs['budget_name'])?$inputs['budget_name']:__('budget');

            $budgetName = $inputs['budget_name'] = in_array(strtolower($inputs['budget_name']),$labelTrans)?
                    __(strtolower($inputs['budget_name'])):$inputs['budget_name'];
            $sukdamName = $inputs['block_sjukdom_name'] = in_array(strtolower($inputs['block_sjukdom_name']),$labelTrans)?
                    __(strtolower($inputs['block_sjukdom_name'])):$inputs['block_sjukdom_name'];


            $sujdamDataArray = [];
            $vaks = ['VACC A','VACC B','VACC C'];
            foreach ($caseNumbers as $case) {
                if($case == 1)
                $caseStr .= '"' . $budgetName . '",';
                if($case == 2)
                $caseStr .= '"'.$sukdamName.'",';
                if($case >= 3){
                    $origLabel = $vaks[$case-3];
                    $labelStr = strtolower(str_replace(' ','_',$origLabel));
                    $vaksLabel = in_array($labelStr,$labelTrans) ? __($labelStr):$origLabel;
                    $caseStr .= '"' . $vaksLabel . '",';
                }


                $chart1_values[] = $value1 = $graphResult['slaktevektRund']['Case' . $case];
                $dataStr1 .= $value1 . ',';

                $chart2_values[] = $value2 = $graphResult['tonnSloyd']['Case' . $case];
                $dataStr2 .= $value2 . ',';

                $chart3_values[] = $value3 = $graphResult['efcr']['Case' . $case];
                $dataStr3 .= $value3 . ',';

                $chart4_values[] = $value4 = $graphResult['prodkostPerKg']['Case' . $case];
                $dataStr4 .= $value4 . ',';

                $chart5_values[] = $value5 = $graphResult['driftsResultat']['Case' . $case];
                $dataStr5 .= $value5 . ',';

                $chart6_values[] = $value6 = $graphResult['lakseprisGjennomsnittKrPerkg']['Case' . $case];
                $dataStr6 .= $value6 . ',';

                $chart9_values[] = $value9 = $graphResult['deadPercentage']['Case' . $case];
                $dataStr9 .= $value9 . ',';


                if($case>1){
                    $biologiskeTap = $graphResult['biologiskeTap']['Case' . $case];
                    $biologiskeTapStr .= $biologiskeTap . ',';
                    $okteUtgifter = $graphResult['okteUtgifter']['Case' . $case];
                    $okteUtgifterStr .= $okteUtgifter . ',';

                    $sujdamDataArray[] = $biologiskeTap;
                    $sujdamDataArray[] = $okteUtgifter;
                }

            }



            //Nikto Radio
            $nkr1 = $graphResult['nytteKostRatio1'];
            $nkr2 = $graphResult['nytteKostRatio2'];

            unset($nkr1['Case1']);
            unset($nkr1['Case2']);
            unset($nkr2['Case1']);
            unset($nkr2['Case2']);

            $nkData = [
                'nytteKostRatio2' => $nkr2
            ];

            $nkLabels = [];
            foreach ($caseNumbers as $case) {

                if($case == 1 || $case ==2)
                    continue;

                $origLabel = $vaks[$case-3];
                $labelStr = strtolower(str_replace(' ','_',$origLabel));
                $vaksLabel = in_array($labelStr,$labelTrans) ? __($labelStr):$origLabel;

                $nkLabels[] = "'".$vaksLabel."'";
            }

            $nkLabelsStr = implode(',',$nkLabels);
            $nkColors = PDFController::getCaseColors();
            $nkColors = array_slice($nkColors,2);


            //Kostnad ved sjukdom
            $sujkdomStepSize = 4000;

            $charts = [];


            $chart1 = PDFController::drawBarChart($caseStr,$dataStr1,$baseValue1);

            $chart1 = urlencode($chart1);

            $chart2 = PDFController::drawBarChart($caseStr,$dataStr2,$baseValue2,null,null,null,null,null,null,1);
            $chart2 = urlencode($chart2);

            $chart3 = PDFController::drawBarChart($caseStr,$dataStr3,$baseValue3);
            $chart3 = urlencode($chart3);


            $chart4 = PDFController::drawBarChart($caseStr,$dataStr4,$baseValue4);
            $chart4 = urlencode($chart4);


            $chart5 = PDFController::drawBarChart($caseStr,$dataStr5,$baseValue5,null,null,null,null,null,null,0);
            $chart5 = urlencode($chart5);

            $chart6 = PDFController::drawBarChart($caseStr,$dataStr6,$baseValue6);
            $chart6 = urlencode($chart6);

            $chart8 = PDFController::drawNikktoGraph($nkLabelsStr,$nkData,$nkColors);
            $chart8 = urlencode($chart8);

            //deadp
            $chart9 = PDFController::drawBarChart($caseStr,$dataStr9,$baseValue9,null,null,null,null,null,true);
            $chart9 = urlencode($chart9);



            // Chart 7
            //Sujkdom
            $sujkdomLabels = explode(',',rtrim($caseStr, ','));
            unset($sujkdomLabels[0]);
            $sujkdomLabels = implode(',',$sujkdomLabels);

            $arrayMaxAbs = max(array_map(function($x){
                return abs($x);
            },$sujdamDataArray));

            $suggestedMax = round($arrayMaxAbs + $arrayMaxAbs/7);

            $chart7 = "{
                    type: 'bar',
                    data: {
                            labels: [" . rtrim($sujkdomLabels, ',') . "],
                            datasets: [{
                                    label: 'biologiskeTap',
                                    backgroundColor: ['rgba(0,167,237,1)', 'rgba(0, 195, 106, 1)', 'rgba(34, 235, 160, 1)', 'rgba(27, 160, 195,1)'],
                                    data: [".rtrim($biologiskeTapStr, ',')."]
                                },{
                                    label: 'okteUtgifter',
                                    backgroundColor: ['rgb(199, 113, 0)', 'rgb(199, 113, 0)','rgb(199, 113, 0)','rgb(199, 113, 0)'],
                                    data: [".rtrim($okteUtgifterStr, ',')."]
                                },],
                    },
                    options: {

                        scales: {
                            xAxes: [{
                                ticks: {
                                    fontSize: " . $grid_font_size . "
                                },
                                offset: true,
                                gridLines: {
                                    drawOnChartArea: false
                                },
                                stacked: true
                            }],
                            yAxes: [{
                                ticks: {
                                    fontSize: " . $grid_font_size . ",
                                    suggestedMax: ".$suggestedMax."
                                },
                                offset: false,
                                gridLines: {
                                    drawOnChartArea: false
                                },
                                stacked: true,
                                minBarLength: 10
                            }]
                        },
                        legend: {
                            display: false
                        },
                        plugins: {
                datalabels: {
                    formatter: ".PDFController::getPDFLabelFormatterCallback(false,1).",
                    anchor: 'center',
                    align: ".$alignCallback.",
                    clamp: true,
                    font: {
                    weight: 'bold',
                    size: " . $label_font_size . ",
                    },
                    color: ".$colorCallback.",

                }
                }
                    }
                }";


                $chart7 = urlencode($chart7);
                $url = "https://quickchart.io/chart?c=".$chart7 ;




            ?>

            <div class="model_table_view" style="width: 100%">



                <table style="width: 100%;border-collapse: collapse;" width="100%">


                    <tr>
                        <td style="width: 100%">

                            <div class="data-block" style="width: 100%">
                                <p>{{__('basic_preconditions_in_the_model')}}</p>
                                <div class="data_row">
                                    <div class="data_column">{{__('number_of_smolts')}}</div>

                                    <div class="data_column">
                                        {{number_format($inputs['vaksinering_produksjonsmodell_antall_smolt_case1'], 0, '.', ' ')}}
                                    </div>

                                </div>

                                <div class="data_row">
                                    <div class="data_column">{{__('salmon_price_nok_kg')}}</div>

                                    <div class="data_column">
                                        {{ $inputs['vaksinering_produksjonsmodell_laksepris_case1'] }}</div>

                                </div>

                                <div class="data_row">
                                    <div class="data_column">{{__('production_cost_nok_kg')}}</div>

                                    <div class="data_column">
                                        {{ $inputs['vaksinering_produksjonsmodell_prod_kost_budsjett_case1']}}</div>

                                </div>

                                <div class="data_row">
                                    <div class="data_column">{{__('smolt_weight_in_grams')}}</div>

                                    <div class="data_column">
                                        {{ $inputs['vaksinering_grunnforutsetninger_budsjett_smoltvekt_gram_case1'] }}
                                    </div>

                                </div>

                                <div class="data_row">
                                    <div class="data_column">{{__('average_weight_at_slaughter_hog_kg')}}</div>

                                    <div class="data_column">{{ $tableViewResult['case1']['slaktevektHOGkg'] }}</div>

                                </div>

                                <div class="data_row">
                                    <div class="data_column">{{__('mortality_percentage')}}</div>

                                    <div class="data_column">{{ $tableViewResult['case1']['deadPercentage'].'%' }}</div>

                                </div>

                                <div class="data_row">
                                    <div class="data_column">{{__('estimated_total_cost_nok_1000')}}</div>

                                    <div class="data_column">{{ $tableViewResult['case1']['totalProdKostCase1'] }}</div>

                                </div>

                                <div class="data_row">
                                    <div class="data_column">
                                        {{__('variable_costs_in_percentage_of_total_production_cost')}}</div>

                                    <div class="data_column">{{ $tableViewResult['case1']['totalVariableKost'].'%' }}
                                    </div>

                                </div>



                            </div>


                        </td>

                    </tr>



                    <tr>
                        <td style="width: 100%;text-align:left">
                            <div style="background-color: white;padding: 5px">


                                <table style="width: 100%" class="vaccine-table">
                                    <thead>
                                        <tr class="table-row white">
                                            <th style="width: 30%">
                                            </th>
                                            <th @if(count($caseNumbers)>4)style="width: 10%"@endif></th>
                                            @foreach ($caseNumbers as $case)
                                            @if($case >= 3)
                                            @php
                                            $origLabel = $vaks[$case-3];
                                            $labelStr = strtolower(str_replace(' ','_',$origLabel));
                                            @endphp
                                            <th>{{in_array($labelStr,$labelTrans) ? __($labelStr):$origLabel }}</th>
                                            @endif
                                            @endforeach

                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr class="table-row white">
                                            <th style="text-align: left">
                                                {{__('effects_disease_and_vaccine')}}
                                            </th>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <th>{{ isset($inputs['block_sjukdom_name'])?$inputs['block_sjukdom_name']:'SAV3'}}
                                            </th>
                                            @elseif($case >= 3)
                                            <th>

                                                <div class="input_value vaccine_input_col">
                                                    {{__('rpp_percentage')}}
                                                </div>
                                                <div class="input_value vaccine_input_col">
                                                    {{__('bi_effect')}}</div>
                                            </th>
                                            @endif
                                            @endforeach
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr class="data_row">
                                            <td>{{__('reduced_weight_at_slaughter_kg')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{$inputs['vaksinering_effekter_sjukdom_redusert_slaktevekt_kg_case1']}}
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{ number_format($inputs['vaksinering_effekter_av_vaksine_tilvekst_kg_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">
                                                    {{$inputs['vaksinering_effekter_av_vaksine_tilvekst_kg_bi_effekt_case' . $case]}}
                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>

                                        <tr class="data_row">
                                            <td>{{__('mortality_percentage')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{number_format($inputs['vaksinering_effekter_sjukdom_kt_ddelighet_prosentpoeng_case1'],1)}}%
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_av_vaksine_ddelighet_poeng_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">
                                                    {{$inputs['vaksinering_effekter_av_vaksine_ddelighet_poeng_bi_effekt_case' . $case]}}%
                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>


                                        <tr class="data_row">
                                            <td>{{__('average_weight_of_increased_mortality_kg')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{number_format($inputs['vaksinering_effekter_sjukdom_vekt_pa_ddfisk_case1'],1)}}
                                            </td>
                                            @elseif($case >= 3)
                                            <td>


                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>



                                        <tr class="data_row">
                                            <td>{{__('increased_bfcr')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{number_format($inputs['vaksinering_effekter_sjukdom_kt_bfcr_case1'],2)}}
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_av_vaksine_bfcr_enhet_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">
                                                    {{$inputs['vaksinering_effekter_av_vaksine_bfcr_enhet_bi_effekt_case' . $case]}}
                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>


                                        <tr class="data_row">
                                            <td>{{__('increased_downgrade_production_quality_biomass')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{number_format($inputs['vaksinering_effekter_sjukdom_kt_nedklassing_prod_kvalitet_case1'],1)}}%
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_av_vaksine_produksjon_poeng_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">
                                                    {{$inputs['vaksinering_effekter_av_vaksine_produksjon_poeng_bi_effekt_case' . $case]}}%
                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>


                                        <tr class="data_row">
                                            <td>{{__('increased_downgrade_draft_biomass')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{number_format($inputs['vaksinering_effekter_sjukdom_utkast_poeng_case1'],1)}}%
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_av_vaksine_utkast_poeng_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">
                                                    {{$inputs['vaksinering_effekter_av_vaksine_utkast_poeng_bi_effekt_case' . $case]}}%
                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>


                                        <tr class="data_row">
                                            <td>{{__('extraordinary_costs_nok_1000')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{$inputs['vaksinering_effekter_sjukdom_ekstraordinre_kostnader_nok_mill_case1'] * 1000 }}
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_av_vaksine_ekstraordinre_kostnader_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">

                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>

                                        <tr class="data_row">
                                            <td>{{__('treatment_costs_nok_1000')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{$inputs['vaksinering_effekter_sjukdom_behandlingskostnad_nok_mill_case1'] * 1000 }}
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_av_vaksine_behandling_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">

                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>


                                        <tr class="data_row">
                                            <td>{{__('costs_of_prophylactic_measures_nok_1000')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{$inputs['vaksinering_effekter_sjukdom_forebygginskostnad_nok_mill_case1'] * 1000 }}
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_av_vaksine_forebygging_rpp_case' . $case],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">

                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>

                                        <tr class="data_row">
                                            <td>{{__('probability_of_disease')}}</td>
                                            @foreach ($caseNumbers as $case)
                                            @if($case == 2)
                                            <td style="text-align: center">
                                                {{number_format($inputs['vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'],1)}}%
                                            </td>
                                            @elseif($case >= 3)
                                            <td>

                                                <div class="input_value vaccine_input_col">
                                                    {{number_format($inputs['vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'],1)}}%
                                                </div>
                                                <div class="input_value vaccine_input_col">

                                                </div>
                                            </td>
                                            @endif
                                            @endforeach
                                        </tr>

                                    </tbody>

                                </table>
                            </div>


                        </td>
                    </tr>

                </table>

            </div>

            <br />

            <div class="model_table_view" style="background-color: white;padding: 5px">
                <table style="width: 100%;margin-top:5px" class="resultant-production vaccine-table">

                    <thead>
                        <tr>
                            <th style="text-align: left">{{__('production_result')}}
                            </th>
                            @foreach ($caseNumbers as $case)
                            @if($case == 1)
                            <th>{{ isset($inputs['budget_name']) ? $inputs['budget_name'] : __('budget')}}
                            </th>
                            @elseif($case == 2)
                            <th>
                                {{ isset($inputs['block_sjukdom_name'])?$inputs['block_sjukdom_name']:'SAV3'}}
                            </th>
                            @elseif($case >= 3)
                            <th>
                                @php
                                $origLabel = $vaks[$case-3];
                                $labelStr = strtolower(str_replace(' ','_',$origLabel));
                                @endphp
                                {{in_array($labelStr,$labelTrans) ? __($labelStr):$origLabel }}
                            </th>
                            @endif
                            @endforeach
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="data_row">
                            <td>{{__('slaughter_weight_round_kg')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['slaktevektRundvektKg']}}
                            </td>

                            @endforeach
                        </tr>

                        <tr class="data_row">
                            <td>{{__('number_of_harvested')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['slaktetAntall']}}
                            </td>

                            @endforeach
                        </tr>


                        <tr class="data_row">
                            <td>{{__('slaughter_weight_hog_kg')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['slaktevektHOGkg']}}
                            </td>

                            @endforeach
                        </tr>


                        <tr class="data_row">
                            <td>{{__('slaughter_volume_hog_kg')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['slaktevolumHOGKg']}}
                            </td>

                            @endforeach
                        </tr>


                        <tr class="data_row">
                            <td>{{__('sales_value_nok_1000')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['salgsverdiNOK1000']}}
                            </td>

                            @endforeach
                        </tr>




                        <tr class="data_row">
                            <td>{{__('production_cost_nok_kg')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['prodkostKrPerKg']}}
                            </td>

                            @endforeach
                        </tr>


                        <tr class="data_row">
                            <td>{{__('operating_profit_nok_1000')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['driftsResultat']}}
                            </td>

                            @endforeach
                        </tr>


                        <tr class="data_row">
                            <td>{{__('benefit_cost_ratio')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{ $case <= 2 ? '': $tableViewResult['case' . $case]['nytteKostRatio2']}}
                            </td>

                            @endforeach
                        </tr>



                        <tr class="data_row">
                            <td>{{__('mortality_percentage')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['deadPercentage']}}%
                            </td>

                            @endforeach
                        </tr>


                        <tr class="data_row">
                            <td>{{__('biomass_deadfish_kg')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['biomasseDeadfiskKg']}}
                            </td>

                            @endforeach
                        </tr>



                        <tr class="data_row">
                            <td>{{__('efcr')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['efcr']}}
                            </td>

                            @endforeach
                        </tr>


                        <tr class="data_row">
                            <td>{{__('average_salmon_price_nok_kg')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['lakseprisGjennomsnittKrPerkg']}}
                            </td>

                            @endforeach
                        </tr>

                        <tr class="data_row">
                            <td>{{__('cost_of_disease_nok_1000')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['kostnadVedSjukdom']}}
                            </td>

                            @endforeach
                        </tr>

                        <tr class="data_row">
                            <td class="tab_space">{{__('increased_expenses_nok_1000')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['okteUtgifterNOK1000']}}
                            </td>

                            @endforeach
                        </tr>

                        <tr class="data_row">
                            <td class="tab_space">{{__('biological_losses_nok_1000')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['biologiskeTapNOK1000']}}
                            </td>

                            @endforeach
                        </tr>



                        <tr class="data_row">
                            <td>{{__('lost_slaughter_volume_hog_kg')}}</td>
                            @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['taptSlaktevolumeHOGKg']}}
                            </td>

                            @endforeach
                        </tr>


                    </tbody>

                </table>
            </div>




            <br />
            <table style="width: 100%">
                <tr>
                    <td style="width: 45%;">
                        <div class="graph_panel left">
                            <p>{{__('average_weight_at_slaughter_kg')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart1);?>
                            </div>
                        </div>
                    </td>

                    <td style="width: 45%;">
                        <div class="graph_panel right">
                            <p>{{__('slaughter_volume_hog_tonn')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart2);?>
                            </div>
                        </div>
                    </td>

                </tr>
            </table>



            <table style="width: 100%">
                <tr>
                    <td style="width: 45%;">
                        <div class="graph_panel left">
                            <p>{{__('economic_feed_conversion_ratio_efcr')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart3);?>
                            </div>
                        </div>
                    </td>

                    <td style="width: 45%;">
                        <div class="graph_panel right">
                            <p>{{__('production_cost_nok_kg')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart4);?>
                            </div>
                        </div>
                    </td>

                </tr>
            </table>



            <table style="width: 100%">
                <tr>
                    <td style="width: 45%;">
                        <div class="graph_panel left">
                            <p>{{__('operating_profit_nok_1000')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart5);?>
                            </div>
                        </div>
                    </td>

                    <td style="width: 45%;">
                        <div class="graph_panel right">
                            <p>{{__('average_salmon_price_nok_kg')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart6);?>
                            </div>
                        </div>
                    </td>

                </tr>
            </table>


            <table style="width: 100%">
                <tr>

                    <td style="width: 45%;">
                        <div class="graph_panel left">
                            <p>{{__('mortality_percentage')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart9);?>
                            </div>
                        </div>
                    </td>


                    <td style="width: 45%;">
                        <div class="graph_panel right">
                            <p>{{__('cost_of_disease_nok_1000')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart7);?>
                            </div>
                        </div>
                    </td>

                </tr>
            </table>


            <table style="width: 100%">
                <tr>

                    <td style="width: 45%;">
                        <div class="graph_panel right">
                            <p>{{__('benefit_cost_ratio')}}</p>
                            <div class="graph_block">
                                <?php echo PDFController::renderImage($chart8);?>
                            </div>
                        </div>
                    </td>

                    <td></td>

                </tr>
            </table>


        </div>
    </div>
</body>
