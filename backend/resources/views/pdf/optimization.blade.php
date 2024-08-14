<?php use App\Http\Controllers\PDFController;?>

<body style="background-color: #f6f6f6">
@php
    $headerData =
    [
    'site'=>$inputs['optimalisering_general_lokalitet_case1'],
    'generation'=>$inputs['optimalisering_general_generasjon_case1'],
    'name'=>$inputs['optimalisering_general_navn_case1'],
    ];
@endphp

@include('pdf.header',$headerData)
@include('pdf.footer')


<div id="pdf_frame">
    <div class="pdf_body">

        {{-- For time line --}}



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
        $gpm_data_str = '';


        $baseValue1 = $graphBaseValue['slaktevektRundKg'];
        $baseValue2 = $graphBaseValue['slaktevolumHOGTonn'];
        $baseValue3 = $graphBaseValue['efcr'];
        $baseValue4 = $graphBaseValue['prodkostPerKg'];
        $baseValue5 = $graphBaseValue['driftsResultatNOK1000'];
        $baseValue6 = $graphBaseValue['LakseprisNOKPerKg'];
        $gpm_base_value = $graphBaseValue['grossProfitMargin'];
        // $baseValue7 = $graphBaseValue['nytteKostRatio'];
        // $baseValue8 = $graphBaseValue['forkostPerKg'];



        foreach ($caseNumbers as $case) {
            $caseStr .= '"' . __('case' . $case) . '",';

            $chart1_values[] = $value1 = $graphResult['slaktevektRundKg']['Case' . $case];
            $dataStr1 .= $value1 . ',';

            $chart2_values[] = $value2 = $graphResult['slaktevolumHOGTonn']['Case' . $case];
            $dataStr2 .= $value2 . ',';

            $chart3_values[] = $value3 = $graphResult['efcr']['Case' . $case];
            $dataStr3 .= $value3 . ',';

            $chart4_values[] = $value4 = $graphResult['prodkostPerKg']['Case' . $case];
            $dataStr4 .= $value4 . ',';

            $chart5_values[] = $value5 = $graphResult['driftsResultatNOK1000']['Case' . $case];
            $dataStr5 .= $value5 . ',';

            $chart6_values[] = $value6 = $graphResult['LakseprisNOKPerKg']['Case' . $case];
            $dataStr6 .= $value6 . ',';

            $gpm_chart_values[] = $gpm_value = $graphResult['grossProfitMargin']['Case' . $case];
            $gpm_data_str .= $gpm_value . ',';
        }

        //Nikto Radio
        //        $nkr1 = $graphResult['nytteKostRatio1'];
        //        $nkr2 = $graphResult['nytteKostRatio2'];
        //
        //        unset($nkr1['Case1']);
        //        unset($nkr2['Case1']);
        //
        //
        //        $nkData = [
        //            'nytteKostRatio2' => $nkr2
        //        ];
        //
        //        $nkLabels = [];
        //        foreach ($nkr1 as $case => $value) {
        //            $nkLabels[] = "'" . __(strtolower($case)) . "'";
        //        }
        //
        //        $nkLabelsStr = implode(',', $nkLabels);
        //        $chart7 = PDFController::drawNikktoGraph($nkLabelsStr, $nkData);
        //        $chart7 = urlencode($chart7);


        // Bar Chart 1
        $charts = [];

        $chart1 = PDFController::drawBarChart($caseStr, $dataStr1, $baseValue1);
        $chart1 = urlencode($chart1);

        $chart2 = PDFController::drawBarChart($caseStr, $dataStr2, $baseValue2, null, null, null, null, null, null, 1);
        $chart2 = urlencode($chart2);

        $chart3 = PDFController::drawBarChart($caseStr, $dataStr3, $baseValue3);
        $chart3 = urlencode($chart3);


        $chart4 = PDFController::drawBarChart($caseStr, $dataStr4, $baseValue4);
        $chart4 = urlencode($chart4);


        $chart5 = PDFController::drawBarChart($caseStr, $dataStr5, $baseValue5, null, null, null, null, null, null, 0);
        $chart5 = urlencode($chart5);

        $chart6 = PDFController::drawBarChart($caseStr, $dataStr6, $baseValue6);
        $chart6 = urlencode($chart6);

        $gpm_chart = PDFController::drawBarChart($caseStr, $gpm_data_str, $gpm_base_value);
        $gpm_chart = urlencode($gpm_chart);



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
                                    {{ number_format($inputs['optimalisering_produksjonsmodell_antall_smolt_case1'], 0, '.', ' ') }}
                                </div>

                            </div>

                            <div class="data_row">
                                <div class="data_column"> {{__('salmon_price_nok_per_kg')}}</div>

                                <div class="data_column">
                                    {{ $inputs['optimalisering_produksjonsmodell_laksepris_case1'] }}</div>

                            </div>

                            <div class="data_row">
                                <div class="data_column"> {{__('prod_cost_nok_per_kg')}} </div>

                                <div class="data_column">
                                    {{ $inputs['optimalisering_produksjonsmodell_prod_kost_case1']}}</div>

                            </div>

                            <div class="data_row">
                                <div class="data_column">{{__('smolt_weight_in_grams')}}</div>

                                <div class="data_column">
                                    {{ preg_replace("/\.00$/",'',number_format($inputs['optimalisering_grunnforutsetninger_smoltvekt_gram_case1'], 2, '.', ' ')) }}
                                </div>

                            </div>

                            <div class="data_row">
                                <div class="data_column">{{__('day_degrees')}}</div>

                                <div class="data_column">
                                    {{ preg_replace("/\.00$/",'',number_format($inputs['optimalisering_grunnforutsetninger_dgngrader_utsett_slakt_case1'], 2, '.', ' ')) }}
                                </div>

                            </div>

                            <div class="data_row">
                                <div class="data_column">{{__('vf3')}}</div>

                                <div class="data_column">
                                    {{ $inputs['optimalisering_grunnforutsetninger_vf3_historisk_case1'] }}
                                </div>

                            </div>


                            <div class="data_row">
                                <div class="data_column">{{__('harvest_weight_hog_kg')}}</div>

                                <div class="data_column">{{ $tableViewResult['case1']['slaktevektHOGkg'] }}</div>

                            </div>

                            <div class="data_row">
                                <div class="data_column">{{__('mortality_percentage')}}</div>

                                <div class="data_column">
                                    {{ $inputs['optimalisering_grunnforutsetninger_ddelighet_case1'].'%' }}</div>

                            </div>

                            <div class="data_row">
                                <div class="data_column">{{__('estimated_total_cost_nok_1000')}}</div>

                                <div class="data_column">{{ $tableViewResult['case1']['totalProdKostCase1'] }}</div>

                            </div>

                            <div class="data_row">
                                <div
                                        class="data_column">{{__('variable_costs_in_percentage_of_total_production_cost')}}</div>

                                <div class="data_column">{{ $tableViewResult['case1']['totalVariableKost'].'%' }}
                                </div>

                            </div>

                        </div>


                    </td>

                </tr>


                <tr>
                    <td style="width: 100%;text-align:left">

                        <br>
                        <div style="background-color: white;padding: 5px">
                            <table style="width: 100%" class="resultant-production vaccine-table">
                                <thead>
                                <tr>
                                    <th style="text-align: left">{{ strtoupper(__('effects_improved_production'))}}
                                    </th>
                                    @foreach ($caseNumbers as $case)
                                        <th>
                                            {{ isset($inputs['name_case'.$case]) ? ( $inputs['name_case'.$case] == 'Case '.$case ? __( strtolower( str_replace( ' ', '', $inputs['name_case'.$case]))) : $inputs['name_case'.$case]) : __('case'.$case)}}
                                        </th>
                                    @endforeach
                                </tr>
                                </thead>

                                <tbody>
                                <tr class="data_row">
                                    <td>{{__('increased_harvest_weight_gram')}}</td>
                                    @foreach ($caseNumbers as $case)

                                        <td>
                                            {{ $case == 1 ? '': $tableViewResult['case' . $case]['oktSlaktevektGram']}}
                                        </td>

                                    @endforeach
                                </tr>

                                <tr class="data_row">
                                    <td>{{__('reduced_mortality_in_percentage')}}</td>
                                    @foreach ($caseNumbers as $case)

                                        <td>
                                            {{$case == 1 ? '': $tableViewResult['case' . $case]['redusertDodelighetPercentage'].'%'}}
                                        </td>

                                    @endforeach
                                </tr>


                                <tr class="data_row">
                                    <td>{{__('average_weight_mortality')}}</td>
                                    @foreach ($caseNumbers as $case)

                                        <td>
                                            {{$case == 1 ? '': $tableViewResult['case' . $case]['snittvektDeadfiskKg']}}
                                        </td>

                                    @endforeach
                                </tr>


                                <tr class="data_row">
                                    <td>{{__('reduced_bfcr')}}</td>
                                    @foreach ($caseNumbers as $case)

                                        <td>
                                            {{$case == 1 ? '': $tableViewResult['case' . $case]['redusertBFCRPercentage'].'%'}}
                                        </td>

                                    @endforeach
                                </tr>


                                <tr class="data_row">
                                    <td>{{__('reduced_in_downgrading_prod_percentage')}}</td>
                                    @foreach ($caseNumbers as $case)

                                        <td>
                                            {{$case == 1 ? '': $tableViewResult['case' . $case]['reduksjonNedklassingProdPercentage'].'%'}}
                                        </td>

                                    @endforeach
                                </tr>

                                <tr class="data_row">
                                    <td>{{__('reduced_discard_percentage')}}</td>
                                    @foreach ($caseNumbers as $case)

                                        <td>
                                            {{$case == 1 ? '': $tableViewResult['case' . $case]['reduksjonUtkastPercentage'].'%'}}
                                        </td>

                                    @endforeach
                                </tr>


                                </tbody>

                            </table>
                        </div>

                    </td>

                </tr>

            </table>


            <br/>
            <div style="background-color: white;padding: 5px">
                <table style="width: 100%;margin-top:5px" class="resultant-production vaccine-table">
                    <thead>
                    <tr>
                        <th style="text-align: left">{{__('result_improve_production')}}
                        </th>
                        @foreach ($caseNumbers as $case)
                            <th>
                                {{ isset($inputs['name_case'.$case]) ? ( $inputs['name_case'.$case] == 'Case '.$case ? __( strtolower( str_replace( ' ', '', $inputs['name_case'.$case]))) : $inputs['name_case'.$case]) : __('case'.$case)}}
                            </th>
                        @endforeach
                    </tr>
                    </thead>

                    <tbody>

                    <tr class="data_row">
                        <td>{{__('slaughter_volume_hog_kg')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{ $tableViewResult['case' . $case]['slaktevolumHGkg']}}
                            </td>

                        @endforeach
                    </tr>

                    <tr class="data_row">
                        <td>{{__('average_salmon_price_nok_kg')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['lakseprisNOKPerKg']}}
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
                        <td>{{__('prod_cost_nok_per_kg')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['prodkostKrPerkg']}}
                            </td>

                        @endforeach
                    </tr>


                    <tr class="data_row">
                        <td> {{__('operating_profit_nok_1000')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['driftsResultatNOK1000']}}
                            </td>

                        @endforeach
                    </tr>

                    <tr class="data_row">
                        <td>{{__('mortality_percentage')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['dodelighetPercentage'].'%'}}
                            </td>

                        @endforeach
                    </tr>

                    <tr class="data_row">
                        <td>{{__('biomass_deadfish_kg')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{$tableViewResult['case' . $case]['biomasseDodfiskKg']}}
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
                        <td>{{__('additional_cost_improvement_production_nok_1000')}}</td>
                        @foreach ($caseNumbers as $case)
                            <td>
                                {{ $case == 1 ? '' : $tableViewResult['case' . $case]['merkostnadTiltakProduksjonNOK1000']}}
                            </td>

                        @endforeach
                    </tr>

                    <tr class="data_row">
                        <td>{{__('additional_cost_improvement_nok_per_kg')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{ $case == 1 ? '' : $tableViewResult['case' . $case]['merkostTiltakKrKg']}}
                            </td>

                        @endforeach
                    </tr>


                    <tr class="data_row">
                        <td>{{__('additional_slaughter_in_kg')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{ $case == 1 ? '' : $tableViewResult['case' . $case]['merslaktKg']}}
                            </td>

                        @endforeach
                    </tr>


                    <tr class="data_row">
                        <td>{{__('increased_profit_nok_1000')}}</td>
                        @foreach ($caseNumbers as $case)

                            <td>
                                {{ $case == 1 ? '' : $tableViewResult['case' . $case]['oktResultatNOK1000']}}
                            </td>

                        @endforeach
                    </tr>

                    <tr class="data_row">
                        <td>{{__('gross_profit_margin')}}</td>
                        @foreach ($caseNumbers as $case)
                            <td>
                                {{ $tableViewResult['case' . $case]['grossProfitMargin'].'%'}}
                            </td>
                        @endforeach
                    </tr>


                    {{--                    <tr class="data_row">--}}
                    {{--                        <td>{{__('benefit_cost_ratio')}}</td>--}}
                    {{--                        @foreach ($caseNumbers as $case)--}}

                    {{--                            <td>--}}
                    {{--                                {{ $case == 1 ? '' : $tableViewResult['case' . $case]['nytteKostRatio2']}}--}}
                    {{--                            </td>--}}

                    {{--                        @endforeach--}}
                    {{--                    </tr>--}}


                    </tbody>

                </table>
            </div>


        </div>

        <br/><br/>
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
                        <br/>
                        <p>{{__('operating_profit_nok_1000')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart5);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <br/>
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
                        <p>{{__('gross_profit_margin_percentage')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($gpm_chart);?>
                        </div>
                    </div>
                </td>

                {{--                <td style="width: 45%;">--}}
                {{--                    <div class="graph_panel left">--}}
                {{--                        <p>{{__('benefit_cost_ratio')}}</p>--}}
                {{--                        <div class="graph_block">--}}
                {{--                            <?php echo PDFController::renderImage($chart7);?>--}}
                {{--                        </div>--}}
                {{--                    </div>--}}
                {{--                </td>--}}

                <td style="width: 45%;">

                </td>

            </tr>
        </table>


    </div>
</div>
</body>
