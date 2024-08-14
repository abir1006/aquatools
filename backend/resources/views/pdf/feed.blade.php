<?php use App\Http\Controllers\PDFController;?>

<body style="background-color: #f6f6f6">

@php
    $headerData =
    [
    'site'=>$tableViewResult['case1']['lokalitet'],
    'generation'=>$tableViewResult['case1']['generasjon'],
    'name'=>$tableViewResult['case1']['ansvarlig']
    ];
@endphp

@include('pdf.header',$headerData)
@include('pdf.footer')

<div id="pdf_frame">
    <div class="pdf_body">


        {{-- For time line --}}

        <div class="model_table_view">

            @foreach ($feedTimeline as $case=>$caseData)

                @php
                    $totalFeeds = count($caseData);
                    $maxWeight = (float) max(array_column($caseData,'feed_max_weight'));
                @endphp

                <div id="feed_module_timeline" style="padding: 0px!important" class="timeline_output">


                    <div style="clear: both">

                        <table style="width: 100%">

                            <tr>
                                @foreach ($caseData as $key=>$feed)

                                    @php

                                        $width = round(((int) $feed['feed_max_weight'] - (int) $feed['feed_min_weight']) *
                                        (100/$maxWeight)) .'%';

                                        $duration = explode('-',$feed['duration']);

                                    @endphp
                                    <th style="width:{{$width}};text-align:right">
                                    <span class="date_end"
                                          style="margin-right: 0px;font-size:9px!important">{{$duration[1]}}</span>

                                    </th>

                                @endforeach

                            </tr>

                            <tr>

                                @foreach ($caseData as $key=>$feed)
                                    @php

                                        $width = round(((int) $feed['feed_max_weight'] - (int) $feed['feed_min_weight']) *
                                        (100/$maxWeight)) .'%';
                                        $slaktevektValue = (float) $slaktevekt[$case];
                                        $feedMaxWeight = (float) $feed['feed_max_weight'];
                                        $maxWeigth = $feedMaxWeight > $slaktevektValue ?$slaktevektValue:$feedMaxWeight;

                                    @endphp

                                    <th style="width:{{$width}};text-align:right;font-size:9px!important">
                                        {{number_format($maxWeigth,2)}} g
                                    </th>
                                @endforeach

                            </tr>
                            <tr style="height:20px;">

                                @foreach ($caseData as $key=>$feed)
                                    @php

                                        $width = round(((int) $feed['feed_max_weight'] - (int) $feed['feed_min_weight']) *
                                        (100/$maxWeight)) .'%';
                                        $name = $feed['feed_producer'];
                                        $color = collect($feedProducer)->first(function($producer,$key) use ($name){
                                        return $producer['name'] == $name;
                                        });

                                    @endphp
                                    <th
                                        style="height:20px;overflow:hidden;width:{{$width}}; background-color:{{$color['color']}};">
                                        <div style="color:#fff; height:20px;overflow:hidden;font-size:10px!important">
                                            {{$feed['feed_name']}}</div>
                                    </th>
                                @endforeach

                            </tr>


                        </table>


                    </div>
                </div>


            @endforeach
        </div>

        <br style="clear: both">
        <div class="model_table_view" style="width: 100%;page-break-inside: auto;">
            @foreach ($feedTimeline as $case=>$caseData)
                <div class="data-block">


                    <table style="width: 100%" class="feed_table" style="page-break-inside: auto;">
                        <caption style="padding-left: 7px;text-align:left">
                            {{__('feed_table')}} {{__('case')}} {{substr($case, -1) }}
                        </caption>

                        <thead>
                        <tr class="data_row">
                            <td>
                                <div class="data_row fist_row" style="padding: 0!important">
                                    <div style="height:5px!important;padding:0 0 0 3px!important;width: 27%;"
                                         class="data_column">{{__('feed_name')}}</div>
                                    <div style="height:5px!important;padding:0!important;width: 10%;text-align:center;"
                                         class="data_column">{{__('min_weight')}}</div>
                                    <div style="height:5px!important;padding:0!important;width: 10%;text-align:center;"
                                         class="data_column">{{__('max_weight')}}</div>
                                    <div style="height:5px!important;padding:0!important;width: 6%;text-align:center;"
                                         class="data_column">{{__('bfcr')}}</div>
                                    <div style="height:5px!important;padding:0!important;width: 6%;text-align:center;"
                                         class="data_column">{{__('vf3')}} </div>
                                    <div style="height:5px!important;padding:0!important;width: 11%;text-align:center;"
                                         class="data_column">{{__('mortality_percentage')}} </div>
                                    <div style="height:5px!important;padding:0!important;width: 9%;text-align:center;"
                                         class="data_column">{{__('feed_price')}}</div>
                                    <div
                                        style="height:5px!important;padding:0!important;width: 21%;text-align:center;vertical-align: bottom;padding-top:10px"
                                        class="data_column">{{__('duration')}}</div>
                                </div>
                            </td>
                        </tr>
                        </thead>


                        @foreach ($caseData as $feed)
                            <tr class="data_row" style="">
                                <td>
                                    <div class="data_row" style="display:table;padding:
                                        0!important;margin:0;@if ($loop->odd)background-color:#ffffff @endif">
                                        <div style="display: table-cell;vertical-align: middle;width: 27%;"
                                             class="data_column"> {{$feed['feed_name']}}</div>
                                        <div
                                            style="display: table-cell;vertical-align: middle;width: 10%;text-align:center;"
                                            class="data_column">{{$feed['feed_min_weight']}}
                                        </div>
                                        <div
                                            style="display: table-cell;vertical-align: middle;width: 10%;text-align:center;"
                                            class="data_column"> {{$feed['feed_max_weight']}}
                                        </div>
                                        <div
                                            style="display: table-cell;vertical-align: middle;width: 6%;text-align:right"
                                            class="data_column"> {{$feed['bfcr']}}</div>
                                        <div
                                            style="display: table-cell;vertical-align: middle;width: 6%;text-align:right"
                                            class="data_column"> {{$feed['vf3']}}</div>
                                        <div
                                            style="display: table-cell;vertical-align: middle;width: 11%;text-align:right"
                                            class="data_column">
                                            {{ isset($feed['mortality']) ? $feed['mortality'] . '%' : '' }}
                                        </div>
                                        <div
                                            style="display: table-cell;vertical-align: middle;width: 9%;text-align:right"
                                            class="data_column"> {{$feed['feed_cost']}}</div>
                                        <div
                                            style="display: table-cell;vertical-align: middle;width: 21%;text-align:right"
                                            class="data_column"> {{$feed['duration']}}</div>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </table>

                </div>
            @endforeach
        </div>


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
        $dataStr10 = '';


        $baseValue1 = $graphBaseValue['slaktevektRund'];
        $baseValue2 = $graphBaseValue['tonnSloyd'];
        $baseValue3 = $graphBaseValue['efcr'];
        $baseValue4 = $graphBaseValue['forprisPerKgFor'];
        $baseValue5 = $graphBaseValue['prodkostPerKg'];
        $baseValue6 = $graphBaseValue['driftsResultat'];
        $baseValue7 = $graphBaseValue['nytteKostRatio'];
        $baseValue8 = $graphBaseValue['forkostPerKg'];
        $baseValue10 = $graphBaseValue['mortality'];


        foreach ($caseNumbers as $case) {
            $caseStr .= '"' . __('case' . $case) . '",';

            $chart1_values[] = $value1 = $graphResult['slaktevektRund']['Case' . $case];
            $dataStr1 .= $value1 . ',';

            $chart2_values[] = $value2 = $graphResult['tonnSloyd']['Case' . $case];
            $dataStr2 .= $value2 . ',';

            $chart3_values[] = $value3 = $graphResult['efcr']['Case' . $case];
            $dataStr3 .= $value3 . ',';

            $chart4_values[] = $value4 = $graphResult['forprisPerKgFor']['Case' . $case];
            $dataStr4 .= $value4 . ',';

            $chart5_values[] = $value5 = $graphResult['prodkostPerKg']['Case' . $case];
            $dataStr5 .= $value5 . ',';

            $chart6_values[] = $value6 = $graphResult['driftsResultat']['Case' . $case];
            $dataStr6 .= $value6 . ',';

            if ($case > 1) {
                $chart7_values[] = $value7 = $graphResult['nytteKostRatio']['Case' . $case];
                $dataStr7 .= $value7 . ',';
            }

            $chart8_values[] = $value8 = $graphResult['forkostPerKg']['Case' . $case];
            $dataStr8 .= $value8 . ',';

            $chart10_values[] = $value10 = $graphResult['mortality']['Case' . $case];
            $dataStr10 .= $value10 . ',';
        }

        //Nikto Radio
        $nkr1 = $graphResult['nytteKostRatio'];
        $nkr2 = $graphResult['nytteKostRatio2'];

        unset($nkr1['Case1']);
        unset($nkr2['Case1']);


        $nkData = [
            'nytteKostRatio2' => $nkr2
        ];

        $nkLabels = [];
        foreach ($nkr1 as $case => $value) {
            $nkLabels[] = "'" . __(strtolower($case)) . "'";
        }

        $nkLabelsStr = implode(',', $nkLabels);
        $chart7 = PDFController::drawNikktoGraph($nkLabelsStr, $nkData);
        $chart7 = urlencode($chart7);

        // Bar Chart 1
        $charts = [];

        $chart1 = PDFController::drawBarChart($caseStr, $dataStr1, $baseValue1, null, null, null, null, null, null, 0);
        $chart1 = urlencode($chart1);

        $chart2 = PDFController::drawBarChart($caseStr, $dataStr2, $baseValue2, null, null, null, null, null, null, 1);
        $chart2 = urlencode($chart2);

        $chart3 = PDFController::drawBarChart($caseStr, $dataStr3, $baseValue3);
        $chart3 = urlencode($chart3);


        $chart4 = PDFController::drawBarChart($caseStr, $dataStr4, $baseValue4);
        $chart4 = urlencode($chart4);


        $chart5 = PDFController::drawBarChart($caseStr, $dataStr5, $baseValue5);
        $chart5 = urlencode($chart5);

        $chart6 = PDFController::drawBarChart($caseStr, $dataStr6, $baseValue6);
        $chart6 = urlencode($chart6);

        $chart8 = PDFController::drawBarChart($caseStr, $dataStr8, $baseValue8);
        $chart8 = urlencode($chart8);

        $chart10 = PDFController::drawBarChart($caseStr, $dataStr10, $baseValue10, null, null, null, null, null, true);
        $chart10 = urlencode($chart10);


        //vektutvikling graph
        $vektutvikling = PDFController::feedSukdomGraph(0);
        $vektutvikling = urlencode($vektutvikling);


        ?>


        <div class="model_table_view table-view-column-count-{{count($caseNumbers)+1}}">

            <div class="data-block" style="width: 100%">
                <table class="pdf_table">
                    <thead>
                    <tr>
                        <th>{{__('basic_preconditions')}}</th>
                        <th></th>

                    </tr>
                    </thead>
                    <tbody>

                    <tr>
                        <td>{{__('release_date')}}</td>
                        <td>{{ $tableViewResult['case1']['utsettsDato'] }}</td>
                    </tr>

                    <tr>
                        <td>{{__('exposure_weight')}}</td>
                        <td>{{ $tableViewResult['case1']['utsettsVekt'] }}</td>
                    </tr>


                    <tr>
                        <td>{{__('number_of_smolts')}}</td>
                        <td>{{ $tableViewResult['case1']['antallSmolt'] }}</td>
                    </tr>


                    <tr>
                        <td>{{__('harvest_date')}}</td>
                        <td>{{ $tableViewResult['case1']['slakteDato'] }}</td>
                    </tr>


                    <tr>
                        <td>{{__('days_in_production')}}</td>
                        <td>{{ $tableViewResult['case1']['dagerIProduksjon'] }}</td>
                    </tr>

                    <tr>
                        <td>{{__('estimated_total_cost_nok_1000')}}</td>
                        <td>{{ $tableViewResult['case1']['totalProdKostCase1'] }}</td>
                    </tr>

                    <tr>
                        <td>{{__('variable_costs_in_percentage_of_total_production_cost')}}</td>
                        <td>{{ $tableViewResult['case1']['totalVariableKost'] }}</td>
                    </tr>


                    </tbody>
                </table>

            </div>


            <table class="pdf_table">
                <thead>
                <tr>
                    <th>{{__('production')}}</th>
                    @foreach ($caseNumbers as $case)
                        <th>{{__('case')}} {{$case}}</th>
                    @endforeach

                </tr>
                </thead>
                <tbody>

                <tr>
                    <td>{{__('harvest_weight')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['slaktevekt'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('vf3')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['vf3'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('growth')}} (kg)</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['tilvekstKg'] }}</td>
                    @endforeach
                </tr>


                <tr>
                    <td>{{__('slaughtered_biomass_net')}} (tonn)</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['slaktetBiomasseNettoTonn'] }}</td>
                    @endforeach
                </tr>


                <tr>
                    <td>{{__('mortality_percentage')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['mortality'] }}%</td>
                    @endforeach
                </tr>


                </tbody>
            </table>

            <table class="pdf_table">
                <thead>
                <tr>
                    <th>{{__('feed')}}</th>
                    @foreach ($caseNumbers as $case)
                        <th>{{__('case')}} {{$case}}</th>
                    @endforeach

                </tr>
                </thead>
                <tbody>

                <tr>
                    <td>{{__('bfcr')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['bfcr'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('efcr')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['efcr'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('amount_of_feed')}} (kg)</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['FormengdeKg'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('feed_costs_mill')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['forkostMill'] }}</td>
                    @endforeach
                </tr>


                </tbody>
            </table>

            <table class="pdf_table">
                <thead>
                <tr>
                    <th>{{__('economy')}}</th>
                    @foreach ($caseNumbers as $case)
                        <th>{{__('case')}} {{$case}}</th>
                    @endforeach

                </tr>
                </thead>
                <tbody>

                <tr>
                    <td>{{__('feed_price_per_kg_of_feed')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['forprisPerKgFor'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('feed_costs_nok_per_kg_produced')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['forkostPerKgProdusert'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('prod_cost_nok_per_kg')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['prodkostPerKg'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('revenues_mill')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['inntekterMill'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('costs_mill')}}l</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['kostnaderMill'] }}</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('operating_profit_nok_mill')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['driftsResultatMill'] }}</td>
                    @endforeach
                </tr>


                <tr>
                    <td>{{__('margin_percentage')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['marginPercentage'] }}%</td>
                    @endforeach
                </tr>

                <tr>
                    <td>{{__('benefit_cost_ratio')}}</td>
                    @foreach ($caseNumbers as $case)
                        <td>{{ $tableViewResult['case'.$case]['kostNytteRatio2'] }}</td>
                    @endforeach
                </tr>

                </tbody>
            </table>


        </div>


        <br/>


        <table style="width: 100%">
            <tr>
                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('harvest_weight_round_gram')}}</p>
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
                        <p>{{__('feed_price_per_kg_of_feed')}}</p>
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
                        <p>{{__('prod_cost_nok_per_kg')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart5);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('operating_profit_nok_mill')}}</p>
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
                        <p>{{__('feed_costs_nok_per_kg_produced')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart8);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('mortality_percentage')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart10);?>
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
                            <?php echo PDFController::renderImage($chart7);?>
                        </div>
                    </div>

                </td>

                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('weight_development')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($vektutvikling);?>
                        </div>
                    </div>
                </td>

            </tr>
        </table>


    </div>
</div>
</body>
