<style>
    @page {
        margin-top: 160px;
        margin-left: 0px;
        margin-right: 0px;
        margin-bottom: 60px,
    }

    html,
    body,
    #pdf_frame {
        background-color: #f6f6f6;
        font-size: 13px !important;
        line-height: 18px;
        font-family: AcuminProCond, sans-serif;
        font-style: normal;
        font-weight: 400;
        color: #3a343a;
        scroll-behavior: smooth;
    }

    .resultant-production tbody tr td {
        text-align: center;
    }

    .resultant-production tbody tr td:first-child {
        text-align: left !important;
    }

    .input_value {
        display: inline-block;
        width: 50%;
        text-align: center
    }

    table {
        page-break-inside: auto;
    }

    header {
        position: fixed;
        left: 0px;
        top: -160px;
        right: 0px;
        height: 160px;

    }

    #footer {
        position: fixed;
        left: 0px;
        bottom: -60px;
        right: 0px;
        height: 60px;
    }

    #footer .pagenum:before {
        content: counter(page);
    }



    .pdf_header {
        width: 100%;
        padding: 15px 15px;
        border-radius: 8px;
        margin-bottom: 5px;
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


    div {
        box-sizing: border-box;
    }

    #pdf_frame {
        padding: 15px 25px;
        width: 100%;
    }

    .pdf_table {
        width: 100%;
        border-collapse: collapse;
        page-break-inside: auto;
        background-color: white;
        padding: 6px;
        margin-bottom: 15px;
    }

    .pdf_table th {
        text-align: left;
    }

    .pdf_table td {
        font-size: 12px !important;
    }

    .pdf_table th,
    .pdf_table td {
        text-align: left;
        padding: 5px 6px 4px;
    }

    .pdf_table th:nth-child(1) {
        font-size: 11px !important;
        text-transform: uppercase !important;
        width: 50%;
        padding: 0px 5px 8px 5px;
    }

    .pdf_table tbody tr:nth-of-type(odd) {
        background-color: #f6f6f6;
    }


    .model_table_view {
        width: 100%;
        padding-right: 0;
        float: none;
        clear: none;
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
        width: 50%;
    }

    .pdf_header {
        width: 100%;
        padding: 15px 15px 10px 15px;
        border-radius: 8px;
        margin-bottom: 5px;
        background-color: #e9f3f4;
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
        float: none;
        clear: both;
    }

    .pdf_page {
        page-break-after: always;
    }

    .graph_panel {
        margin-bottom: 20px;
        width: 95%;
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
    }

    .footer .copy_text {
        float: right;
        text-align: right;
    }

    .clearfix {
        clear: right;
    }

    .model_table_view table td {
        vertical-align: top
    }

    .company {
        font-family: AcuminProCond;
        font-size: 22px !important;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.43;
        letter-spacing: 0.7px;
        text-align: left;
        color: #3a343a;
    }

    .table-row {
        padding: 5px;
    }

    .white {
        background-color: white
    }

    .vaccine-table {
        border: 0;
        border-collapse: collapse;
    }

    .vaccine-table th,
    .vaccine-table td {
        padding: 5px;
        border: 0;
    }

    .left {
        margin-right: 15px;
    }

    .right {
        margin-left: 17px;
    }

    td.tab_space {
        padding-left: 25px;
    }
</style>


<script type="text/php">

    if (isset($pdf)) {
            $text = __('page')."  {PAGE_NUM} / {PAGE_COUNT}";
            $size = 9;
            $font = $fontMetrics->getFont("Verdana");
            $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
            $x = ($pdf->get_width() - $width) / 2;
            $y = $pdf->get_height() - 40;
            $color = array(0.565, 0.565, 0.565);
            $pdf->page_text($x, $y, $text, $font, $size,$color);
        }
    </script>

<header style="width: 100%; margin-top: 0px; margin-bottom: 10px;background-color: #f6f6f6">
    <div class="pdf_header" style="background-color: #e9f3f4;width:90%;position:relative;top:15px;left:25px">
        <div class="pdf_header_text">
            <div class="company">{{$pdfUserData['company']}}</div>
            <p> {{__('site')}}: {{$site }} </p>
            <p> {{__('generation')}}: {{$generation}} </p>
            <p> {{__('name')}}: {{$name}} </p>
            <p> {{__('date')}}: {{ str_replace('/','.',$pdfUserData['date']) }}</p>
        </div>
        <div class="pdf_header_logo">
            @if (trim($pdfUserData['company_logo_url']) !== '')
            <img src="{{$pdfUserData['company_logo_url']}}" />
            @endif
        </div>
    </div>
</header>
