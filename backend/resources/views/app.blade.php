<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <base href="/">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="icon" href="{{ asset('images/favicon_32x32px.png')}}" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AquaTools 2.0</title>
    <!-- Styles -->


    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="{{ asset('css/main.css') }}" rel="stylesheet">
    <script type="text/javascript"
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA7X-EPMrk1UFab4wG8uudZuVuE-edncTI&libraries=places">
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.7.1/tinymce.min.js"
        integrity="sha512-RnlQJaTEHoOCt5dUTV0Oi0vOBMI9PjCU7m+VHoJ4xmhuUNcwnB5Iox1es+skLril1C3gHTLbeRepHs1RpSCLoQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

</head>

<body>
    <div id="app"></div>
    <script src="{{ asset('js/app.js?id='. time()) }}" defer></script>
</body>

</html>