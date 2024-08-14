<?php use App\Http\Controllers\PDFController;?>
        <!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <title>AquaTools 2.0</title>

    <style>
        @font-face {
            font-family: 'Acumin Pro';
            font-style: normal;
            font-weight: normal;
            src: url("{{ storage_path('fonts/Acumin-RPro.woff') }}") format('woff');

        }

        @page {
            margin: 0;
        }

        html,
        body,
        #pdf_frame {
            background-color: #f6f6f6;
            font-size: 13px !important;
            line-height: 18px;
            font-family: "Acumin Pro", sans-serif;
            font-style: normal;
            font-weight: 400;
            color: #3a343a;
            scroll-behavior: smooth;
        }

        div {
            box-sizing: border-box;
        }

        #pdf_frame {
            padding: 15px 25px;
            width: 100%;
        }


        .model_table_view {
            width: 100%;
            padding-right: 0;
            float: none;
            clear: left;
        }

        .model_graph_view {
            width: 41.5%;
            float: right;
            padding: 0;
        }

        .model_table_view .data-block {
            background-color: white;
            padding: 6px;
            margin-bottom: 10px;
        }

        .model_table_view .data-block p {
            font-weight: bold;
            margin: 0;
            padding: 0 5px 5px;
        }

        .model_table_view .data_row {
            padding: 5px 6px 4px;
            margin: 0;
            width: 100%;
            background-color: white;
        }

        .model_table_view .data_row:nth-of-type(odd) {
            background-color: #f6f6f6;
        }

        .model_table_view .data_row.fist_row {
            font-size: 11px !important;
            text-transform: uppercase !important;
        }

        .model_table_view .data_column {
            padding: 0;
            margin: 0;
            text-align: left;
            display: inline-block;
        }

        .table-view-column-count-2 .data_column {
            width: 50%;
        }

        .table-view-column-count-3 .data_column {
            width: 25%;
        }

        .table-view-column-count-4 .data_column {
            width: 16.666666667%;
        }

        .table-view-column-count-5 .data_column {
            width: 12%;
        }

        .table-view-column-count-6 .data_column {
            width: 10%;
        }

        .table-view-column-count-7 .data_column {
            width: 8.333333333%;
        }

        .model_table_view .data_row .data_column:first-child {
            width: 45%;
        }

        .pdf_header {
            width: 100%;
            padding: 15px;
            border-radius: 8px;
            background-color: #e9f3f4;
            margin-bottom: 15px;
        }

        .pdf_header h1,
        .pdf_header p {
            padding: 0;
            margin: 0;
        }

        .pdf_header_text {
            padding-top: 7.5px;
            width: 74%;
            display: inline-block;
        }

        .pdf_header_logo {
            width: 25%;
            padding-top: 7.5px;
            display: inline-block;
            text-align: right;
        }

        .pdf_header_logo img {
            width: auto;
            height: 65px;
        }

        .pdf_body {
            width: 100%;
            display: block;
            float: left;
            clear: both;
            height: 920px;
        }

        .pdf_page {
            page-break-after: always;
        }

        .graph_panel {
            margin-bottom: 20px;
            width: 95%;
        }

        .left {
            margin-right: 15px;
        }

        .right {
            margin-left: 17px;
        }


        .graph_left {
            float: left;
            clear: left;
        }

        .graph_right {
            float: right;
            clear: right;
        }

        .graph_panel p {
            padding: 0;
            margin: 0 0 8px 0;
            font-weight: bold;
            font-size: 14px !important;
        }

        .graph_block {
            background-color: white;
            padding: 15px;
        }

        .graph_block img {
            width: 100%;
            height: auto;
        }

        .pdf_page {
            page-break-after: always;
        }

        .footer {
            width: 100%;
            clear: left;
            padding: 5px 0 20px 0;
        }

        .footer .logo,
        .footer .middle,
        .footer .copy_text {
            width: 33%;
        }

        .footer .logo {
            float: left;
            clear: left;
            text-align: left;
        }

        .footer .middle {
            float: left;
            font-size: 9px !important;
        }

        .footer .copy_text {
            float: right;
            text-align: right;
            font-size: 9px !important;
        }

        .clearfix {
            clear: right;
        }
    </style>
</head>

<body>
<div id="pdf_frame">
    <div class="pdf_header">
        <div class="pdf_header_text">
            <h1>{{$pdfUserData['company']}}</h1>
            <p> {{__('customer')}}: {{$pdfUserData['name']}} </p>
            <p>{{__('date')}}: {{ str_replace('/','.',$pdfUserData['date']) }}</p>
        </div>
        <div class="pdf_header_logo">
            @if (trim($pdfUserData['company_logo_url']) !== '')
                <img src="{{$pdfUserData['company_logo_url']}}"/>
            @endif
        </div>
    </div>
    <div class="pdf_body">
        <div class="model_table_view table-view-column-count-{{count($caseNumbers)+1}}">


            <div class="data-block">

                <div class="data_row">

                </div>

                <div class="data_row">
                    <div class="data_column" style="font-weight: bold;">{{__('variables')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column"
                             style="font-weight: bold;">{{ isset($modelCaseText['case'.$case]) ? $modelCaseText['case'.$case] :  __('case') . ' ' .  $case}}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('number_of_licenses')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case1']['antallKons'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('available_mtb_tons')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['tilgjengeligMTBTonn'] }}</div>
                    @endforeach
                </div>
            </div>


            <div class="data-block">
                <p>{{__('production')}}</p>
                <div class="data_row">
                    <div class="data_column">{{__('mtb_utilization_percentage')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['mtbUtnytting'].'%' }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('average_temp_c')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['snitttemp'] }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('smolt_weight_in_grams')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['smoltvektGram'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('average_weight_at_slaughter_kg')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['slaktevektRundKg'] }}</div>
                    @endforeach
                </div>

            </div>
            <div class="data-block">
                <p>{{__('biology')}}</p>
                <div class="data_row">
                    <div class="data_column">{{__('increased_vf3')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['vf3'] }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('bfcr')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['bfcr'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('waste_percentage_biomass_per_month')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['svinnBiomassePerMnd'].'%' }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('downgrade_production_quality_percentage_biomass')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['nedklassingProdBiomasse']}}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('draft_percentage_biomass')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['utkastBiomasse'] }}</div>
                    @endforeach
                </div>
            </div>

            <div class="data-block">
                <p>{{__('costs_and_prices')}}</p>
                <div class="data_row">
                    <div class="data_column">{{__('smolt_cost_nok_per_fish')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['smoltPrisNOKPerStk'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('feed_cost_nok_kg')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['forprisNokPerKg'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('dead_fish_nok_kg')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['dodfiskNokPerKg'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('well_boat_and_harvest_cost_per_kg_hog')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['innkjoringOgSlaktPerKgHOG'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('cost_prod_qual_nok_per_kg_hog')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['prodkvalitetRedusertPrisPerKg'] }}
                        </div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('salmon_price')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['laksepris'] }}</div>
                    @endforeach
                </div>
            </div>


            <div class="data-block">
                <p>{{__('result')}}</p>
                <div class="data_row">
                    <div class="data_column">{{__('tons_per_cone_per_year')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['tonnPerKonsPerAr'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('tons_per_company_hog')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['tonnPerSelsKapHOG'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('increased_production_per_year_percentage')}}</div>
                    @foreach ($caseNumbers as $case)
                        @if($case == 1)
                            <div class="data_column"></div>
                        @else
                            <div class="data_column">
                                {{ $tableViewResult['case'.$case]['oktProduksjonPerAr'].'%' }}
                            </div>
                        @endif
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('produced_sea_tons')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['produsertSjoTonn'] }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('sales_revenues_nok_mill')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['salgsinntekterNOK1000'] }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('total_costs_nok_mill')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['sumKostnaderNOK1000'] }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('result_nok_mill')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['resultatNOK1000'] }}</div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="logo"><img height="26" src="images/at2_logo1.png"/></div>
        <div class="middle" style="text-align: center">{{__('page')}} 1/5</div>
        <div class="copy_text"><?php echo date('Y');?> &copy; SpillFree Analytics AS</div>
    </div>

    <div class="pdf_page"></div>

    <div class="pdf_header" style="margin-top: 15px;">
        <div class="pdf_header_text">
            <h1>{{$pdfUserData['company']}}</h1>
            <p> {{__('customer')}}: {{$pdfUserData['name']}} </p>
            <p>{{__('date')}}: {{ str_replace('/','.',$pdfUserData['date']) }}</p>
        </div>
        <div class="pdf_header_logo">
            @if (trim($pdfUserData['company_logo_url']) !== '')
                <img src="{{$pdfUserData['company_logo_url']}}"/>
            @endif
        </div>
    </div>
    <div class="pdf_body">
        <div class="model_table_view table-view-column-count-{{count($caseNumbers)+1}}">

            <div class="data-block">

                <div class="data_row">

                </div>

                <div class="data_row">
                    <div class="data_column" style="font-weight: bold;">{{__('result')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column"
                             style="font-weight: bold;">{{ isset($modelCaseText['case'.$case]) ? $modelCaseText['case'.$case] :  __('case') . ' ' .  $case}}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('increased_result_nok_1000')}}</div>
                    @foreach ($caseNumbers as $case)
                        @if($case == 1)
                            <div class="data_column"></div>
                        @else
                            <div class="data_column">{{ $tableViewResult['case'.$case]['oktResultatNOK1000'] }}</div>
                        @endif
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('improved_profit_percentage')}}</div>
                    @foreach ($caseNumbers as $case)
                        @if($case == 1)
                            <div class="data_column"></div>
                        @else
                            <div class="data_column">
                                {{ $tableViewResult['case'.$case]['forbedringResultatPercentage'].'%' }}
                            </div>
                        @endif
                    @endforeach
                </div>
                {{--                <div class="data_row">--}}
                {{--                    <div class="data_column">{{__('benefit_cost_ratio')}} 2</div>--}}
                {{--                    @foreach ($caseNumbers as $case)--}}
                {{--                        @if ($case == 1)--}}
                {{--                            <div class="data_column"></div>--}}
                {{--                        @else--}}
                {{--                            <div class="data_column">{{ $tableViewResult['case'.$case]['nytteKostRatio2'] }}</div>--}}
                {{--                        @endif--}}
                {{--                    @endforeach--}}
                {{--                </div>--}}
                <div class="data_row">
                    <div class="data_column">{{__('gross_profit_margin')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['grossProfitMargin'].'%'  }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('production_cost_nok_kg')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['prodkostPerKgHOG'] }}</div>
                    @endforeach
                </div>
                <div class="data_row">
                    <div class="data_column">{{__('average_salmon_price_nok_per_kg_hog')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['snittLakseprisNokPerKgHog'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('smolt_per_cons_per_year_1000')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['smoltPerKonsPerAr1000'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('smolt_per_year_company_mill')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['smoltPerArSelskapMill'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('efcr')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['eFCR'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('dead_fish_ton_per_year')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['dodfiskTonnPerAr'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('deaths_per_gene_percentage')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['dodePerGen'].'%' }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('days_at_sea')}}</div>
                    @foreach ($caseNumbers as $case)
                        <div class="data_column">{{ $tableViewResult['case'.$case]['dagerISjø'] }}</div>
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('reduced_days_in_sea')}}</div>
                    @foreach ($caseNumbers as $case)
                        @if ($case == 1)
                            <div class="data_column"></div>
                        @else
                            <div class="data_column">
                                {{ $tableViewResult['case'.$case]['reduserteDager'] == 0 ? '-' : $tableViewResult['case'.$case]['reduserteDager'] }}
                            </div>
                        @endif
                    @endforeach
                </div>

                <div class="data_row">
                    <div class="data_column">{{__('reduction_risk_time_percentage')}}</div>
                    @foreach ($caseNumbers as $case)
                        @if ($case == 1)
                            <div class="data_column"></div>
                        @else
                            <div class="data_column">
                                {{ $tableViewResult['case'.$case]['reduksjonRisikotid'].'%' }}
                            </div>
                        @endif
                    @endforeach
                </div>
            </div>
        </div>


        {{-- graph started --}}

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
        $dataStr10 = '';
        $dataStr11 = '';
        $dataStr12 = '';
        $dataStr13 = '';
        $dataStr14 = '';
        $dataStr15 = '';
        $dataStr16 = '';
        $dataStr17 = '';

        $baseValue1 = $graphBaseValue['tonnPerKonsPerAr'];
        $baseValue2 = $graphBaseValue['tonnSolgtPerSelskapPerAr'];
        $baseValue3 = $graphBaseValue['resultatIMill'];
        $baseValue4 = $graphBaseValue['eFcr'];
        $baseValue5 = $graphBaseValue['prodKost'] ?: 0;
        $baseValue6 = $graphBaseValue['lakseprisSnittKrPerKg'] ?: 0;
        $baseValue7 = $graphBaseValue['marginKrPerKgHOG'];
        $baseValue8 = $graphBaseValue['sgr'];
        $baseValue9 = $graphBaseValue['dagerISjo'];
        $baseValue10 = $graphBaseValue['snittvektSloyd'];
        $baseValue11 = $graphBaseValue['dodeAntall'];
        $baseValue12 = $graphBaseValue['dodeTonn'];
        $baseValue13 = $graphBaseValue['dodePerGen'];
        $baseValue14 = $graphBaseValue['smoltVektKg'];
        $baseValue15 = $graphBaseValue['smoltPerKonsPerAr'];
        $baseValue16 = $graphBaseValue['nytteKostRatio'];
        $baseValue17 = $graphBaseValue['grossProfitMargin'];

        foreach ($caseNumbers as $case) {
            $caseStr .= isset($modelCaseText['case' . $case]) ? '"' . $modelCaseText['case' . $case] . '",' : '"Case' . $case . '",';
            // $caseStr .= '"Case' . $case . '",';

            $chart1_values[] = $graphResult['tonnPerKonsPerAr']['Case' . $case];
            $dataStr1 .= PDFController::mtbGraphValue($graphResult, 'tonnPerKonsPerAr', $case) . ',';

            $chart2_values[] = $graphResult['tonnSolgtPerSelskapPerAr']['Case' . $case];
            $dataStr2 .= PDFController::mtbGraphValue($graphResult, 'tonnSolgtPerSelskapPerAr', $case) . ',';

            $chart3_values[] = $graphResult['resultatIMill']['Case' . $case];
            $dataStr3 .= PDFController::mtbGraphValue($graphResult, 'resultatIMill', $case) . ',';

            $chart4_values[] = $graphResult['eFcr']['Case' . $case];
            $dataStr4 .= PDFController::mtbGraphValue($graphResult, 'eFcr', $case) . ',';

            $chart5_values[] = $graphResult['prodKost']['Case' . $case];
            $dataStr5 .= PDFController::mtbGraphValue($graphResult, 'prodKost', $case) . ',';

            $chart6_values[] = $graphResult['lakseprisSnittKrPerKg']['Case' . $case];
            $dataStr6 .= PDFController::mtbGraphValue($graphResult, 'lakseprisSnittKrPerKg', $case) . ',';

            $chart7_values[] = $graphResult['marginKrPerKgHOG']['Case' . $case];
            $dataStr7 .= PDFController::mtbGraphValue($graphResult, 'marginKrPerKgHOG', $case) . ',';

            $chart8_values[] = $graphResult['sgr']['Case' . $case];
            $dataStr8 .= PDFController::mtbGraphValue($graphResult, 'sgr', $case) . ',';

            $chart9_values[] = $graphResult['dagerISjo']['Case' . $case];
            $dataStr9 .= PDFController::mtbGraphValue($graphResult, 'dagerISjo', $case) . ',';

            $chart10_values[] = $graphResult['snittvektSloyd']['Case' . $case];
            $dataStr10 .= PDFController::mtbGraphValue($graphResult, 'snittvektSloyd', $case) . ',';

            $chart11_values[] = $graphResult['dodeAntall']['Case' . $case];
            $dataStr11 .= PDFController::mtbGraphValue($graphResult, 'dodeAntall', $case) . ',';

            $chart12_values[] = $graphResult['dodeTonn']['Case' . $case];
            $dataStr12 .= PDFController::mtbGraphValue($graphResult, 'dodeTonn', $case) . ',';

            $chart13_values[] = $graphResult['dodePerGen']['Case' . $case];
            $dataStr13 .= PDFController::mtbGraphValue($graphResult, 'dodePerGen', $case) . ',';

            $chart14_values[] = $graphResult['smoltVektKg']['Case' . $case];
            $dataStr14 .= PDFController::mtbGraphValue($graphResult, 'smoltVektKg', $case) . ',';

            $chart15_values[] = $graphResult['smoltPerKonsPerAr']['Case' . $case];
            $dataStr15 .= PDFController::mtbGraphValue($graphResult, 'smoltPerKonsPerAr', $case) . ',';

            $chart17_values[] = $graphResult['grossProfitMargin']['Case' . $case];
            $dataStr17 .= PDFController::mtbGraphValue($graphResult, 'grossProfitMargin', $case) . ',';
            //$chart16_values[] = $graphResult['nytteKostRatio1']['Case' . $case];
            //$dataStr16 .= $graphResult['nytteKostRatio1']['Case' . $case] . ',';
        }

        // Process datastr for nytte/kost ratio

        //Nikto Radio
        $nkr1 = $graphResult['nytteKostRatio1'];
        $nkr2 = $graphResult['nytteKostRatio2'];

        unset($nkr1['Case1']);
        unset($nkr2['Case1']);

        $nkData = [
            'nytteKostRatio2' => $nkr2
        ];

        $nkLabels = [];
        foreach ($nkr2 as $case => $value) {
            $case_text = isset($modelCaseText[strtolower($case)]) ? $modelCaseText[strtolower($case)] : $case;
            $nkLabels[] = "'" . $case_text . "'";
        }

        $nkLabelsStr = implode(',', $nkLabels);


        // Bar Chart 1

        $chart1 = PDFController::drawMTBBarChart($caseStr, $dataStr1, $baseValue1, null, null, null, null, null, null, 1);
        $chart1 = urlencode($chart1);

        $chart2 = PDFController::drawMTBBarChart($caseStr, $dataStr2, $baseValue2, null, null, null, null, null, null, 1);
        $chart2 = urlencode($chart2);

        $chart3 = PDFController::drawMTBBarChart($caseStr, $dataStr3, $baseValue3, null, null, null, null, null, null, 1);
        $chart3 = urlencode($chart3);


        $chart4 = PDFController::drawMTBBarChart($caseStr, $dataStr4, $baseValue4);
        $chart4 = urlencode($chart4);


        $chart5 = PDFController::drawMTBBarChart($caseStr, $dataStr5, $baseValue5);
        $chart5 = urlencode($chart5);

        $chart6 = PDFController::drawMTBBarChart($caseStr, $dataStr6, $baseValue6);
        $chart6 = urlencode($chart6);

        $chart7 = PDFController::drawMTBBarChart($caseStr, $dataStr7, $baseValue7);
        $chart7 = urlencode($chart7);

        $chart8 = PDFController::drawMTBBarChart($caseStr, $dataStr8, $baseValue8, null, null, null, null, null, true);
        $chart8 = urlencode($chart8);

        $chart9 = PDFController::drawMTBBarChart($caseStr, $dataStr9, $baseValue9);
        $chart9 = urlencode($chart9);

        $chart10 = PDFController::drawMTBBarChart($caseStr, $dataStr10, $baseValue10);
        $chart10 = urlencode($chart10);

        $chart11 = PDFController::drawMTBBarChart($caseStr, $dataStr11, $baseValue11, null, null, null, null, null, null, 0);
        $chart11 = urlencode($chart11);

        $chart12 = PDFController::drawMTBBarChart($caseStr, $dataStr12, $baseValue12, null, null, null, null, null, null, 1);
        $chart12 = urlencode($chart12);

        $chart13 = PDFController::drawMTBBarChart($caseStr, $dataStr13, $baseValue13, null, null, null, null, null, true);
        $chart13 = urlencode($chart13);

        $chart14 = PDFController::drawMTBBarChart($caseStr, $dataStr14, $baseValue14);
        $chart14 = urlencode($chart14);

        $chart15 = PDFController::drawMTBBarChart($caseStr, $dataStr15, $baseValue15, null, null, null, null, null, null, 0);
        $chart15 = urlencode($chart15);

        $chart17 = PDFController::drawMTBBarChart($caseStr, $dataStr17, $baseValue17, null, null, null, null, null, null, 0);
        $chart17 = urlencode($chart17);

        //        $chart16 = PDFController::drawNikktoGraph($nkLabelsStr,$nkData);
        //        $chart16 = urlencode($chart16);

        ?>


    </div>

    <div class="footer">
        <div class="logo"><img height="26" src="images/at2_logo1.png"/></div>
        <div class="middle" style="text-align: center">{{__('page')}} 2/5</div>
        <div class="copy_text"><?php echo date('Y');?> &copy; SpillFree Analytics AS</div>
    </div>


    <div class="pdf_page"></div>

    <div class="pdf_header" style="margin-top: 15px;">
        <div class="pdf_header_text">
            <h1>{{$pdfUserData['company']}}</h1>
            <p> {{__('customer')}}: {{$pdfUserData['name']}} </p>
            <p>{{__('date')}}: {{ str_replace('/','.',$pdfUserData['date']) }}</p>
        </div>
        <div class="pdf_header_logo">
            @if (trim($pdfUserData['company_logo_url']) !== '')
                <img src="{{$pdfUserData['company_logo_url']}}"/>
            @endif
        </div>
    </div>
    <div class="pdf_body">

        <br>
        <table style="width: 100%">
            <tr>
                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('tons_per_cone_per_year')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart1);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('tons_sold_per_company_per_year')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart2);?>
                        </div>
                    </div>
                </td>

            </tr>
        </table>

        <br>
        <table style="width: 100%">
            <tr>
                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('results_mill')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart3);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('production_cost')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart5);?>
                        </div>
                    </div>
                </td>


            </tr>
        </table>

        <br>
        <table style="width: 100%">
            <tr>

                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('average_salmon_price_nok_kg')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart6);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('margin_nok_kg_hog')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart7);?>
                        </div>
                    </div>
                </td>


            </tr>
        </table>


    </div>

    <div class="footer">
        <div class="logo"><img height="26" src="images/at2_logo1.png"/></div>
        <div class="middle" style="text-align: center">{{__('page')}} 3/5</div>
        <div class="copy_text"><?php echo date('Y');?> &copy; SpillFree Analytics AS</div>
    </div>


    <div class="pdf_page"></div>

    <div class="pdf_header" style="margin-top: 15px;">
        <div class="pdf_header_text">
            <h1>{{$pdfUserData['company']}}</h1>
            <p> {{__('customer')}}: {{$pdfUserData['name']}} </p>
            <p>{{__('date')}}: {{ str_replace('/','.',$pdfUserData['date']) }}</p>
        </div>
        <div class="pdf_header_logo">
            @if (trim($pdfUserData['company_logo_url']) !== '')
                <img src="{{$pdfUserData['company_logo_url']}}"/>
            @endif
        </div>
    </div>
    <div class="pdf_body">

        <br>
        <table style="width: 100%">
            <tr>
                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('efcr')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart4);?>
                        </div>
                    </div>
                </td>
                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('sgr')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart8);?>
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <br>
        <table style="width: 100%">
            <tr>
                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('days_at_sea')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart9);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('deaths_1000')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart11);?>
                        </div>
                    </div>
                </td>


            </tr>
        </table>

        <br>
        <table style="width: 100%">
            <tr>


                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('døde_tonn')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart12);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('deaths_per_gene_percentage')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart13);?>
                        </div>
                    </div>
                </td>

            </tr>
        </table>


    </div>

    <div class="footer">
        <div class="logo"><img height="26" src="images/at2_logo1.png"/></div>
        <div class="middle" style="text-align: center">{{__('page')}} 4/5</div>
        <div class="copy_text"><?php echo date('Y');?> &copy; SpillFree Analytics AS</div>
    </div>


    <div class="pdf_page"></div>

    <div class="pdf_header" style="margin-top: 15px;">
        <div class="pdf_header_text">
            <h1>{{$pdfUserData['company']}}</h1>
            <p> {{__('customer')}}: {{$pdfUserData['name']}} </p>
            <p>{{__('date')}}: {{ str_replace('/','.',$pdfUserData['date']) }}</p>
        </div>
        <div class="pdf_header_logo">
            @if (trim($pdfUserData['company_logo_url']) !== '')
                <img src="{{$pdfUserData['company_logo_url']}}"/>
            @endif
        </div>
    </div>
    <div class="pdf_body">


        <br>
        <table style="width: 100%">
            <tr>

                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('average_harvest_weight_round_hog')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart10);?>

                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('smolt_weight_in_kg')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart14);?>
                        </div>
                    </div>
                </td>

            </tr>
        </table>


        <br>
        <table style="width: 100%">
            <tr>
                <td style="width: 45%;">
                    <div class="graph_panel left">
                        <p>{{__('smolt_per_cons_per_year_1000')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart15);?>
                        </div>
                    </div>
                </td>

                <td style="width: 45%;">
                    <div class="graph_panel right">
                        <p>{{__('gross_profit_margin')}}</p>
                        <div class="graph_block">
                            <?php echo PDFController::renderImage($chart17);?>
                        </div>
                    </div>
                </td>


                {{--                <td style="width: 45%;">--}}
                {{--                    <div class="graph_panel right">--}}
                {{--                        <p>{{__('benefit_cost_ratio')}}</p>--}}
                {{--                        <div class="graph_block">--}}
                {{--                            <?php echo PDFController::renderImage($chart16);?>--}}
                {{--                        </div>--}}
                {{--                    </div>--}}
                {{--                </td>--}}

            </tr>
        </table>

    </div>

    <div class="footer">
        <div class="logo"><img height="26" src="images/at2_logo1.png"/></div>
        <div class="middle" style="text-align: center">{{__('page')}} 5/5</div>
        <div class="copy_text"><?php echo date('Y');?> &copy; SpillFree Analytics AS</div>
    </div>


</div>
</body>

</html>
