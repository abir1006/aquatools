<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <style>
        body {
            font-family: Roboto, Arial, serif;
            padding: 0;
            margin: 0;
            width: 100%;
            float: left;
            font-size: 18px;
        }

        table {
            width: 100%;
            border-spacing: 0;
        }

        tbody {
            display: block;
        }

        table tr {
            display: table;
            width: 100%;
        }

        table tr td {
            /*width: 100%;*/
        }

        div {
            box-sizing: border-box;
        }

        p {
            padding: 0;
            margin: 0;
            font-size: 18px;
            font-family: Roboto, Arial, serif;
        }

        #email_header {
            background-color: #102640;
            text-align: center;
            padding: 23px 0;
        }

        #email_header img {
            width: 100%;
            height: auto;
            max-width: 260px;
        }

        #wrap td {
            background-color: #f6f6f6;
            width: 100%;
            padding: 3%;
        }

        #email_body {
            width: 100%;
            background-color: #ffffff;
            border-radius: 12px;
            border-spacing: 12px;
        }

        #email_body td {
            width: 100%;
            background-color: #ffffff;
            padding-bottom: 10px;
        }

        #email_body td#email_social_links {
            width: 100%;
            margin-top: 20px;
            padding-top: 0;
            padding-bottom: 3%;
        }

        #email_social_links a {
            text-decoration: none;
        }

        #email_social_links .fa-facebook-square {
            color: #5072b8;
        }

        #email_social_links .fa-linkedin {
            color: #007ab5
        }
    </style>
</head>

<body>
<table>
    <tbody>
    <tr id="email_header">
        <td>
            <a target="_blank" href="{{config('app.frontend_url')}}">
                <img width="260" alt="" src="{{config('app.frontend_url') . '/images/at2_admin_logo_new.png' }}"/>
            </a>
        </td>
    </tr>
    </tbody>
</table>
<table id="wrap">
    <tr>
        <td style="padding: 3.75%">
            <table id="email_body">
                <tr>
                    <td>
