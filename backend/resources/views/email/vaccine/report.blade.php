@include('email.header')
<p>Hi {{$name}},</p>
<br/>
@if($email_to == 'others')
    <p>Thank you for using AquaTools. Please find attached a report for you in {{$type}} format generated from Vaccine
        Model.</p>
@else
    <p>Thank you for using AquaTools. Please find the attached report in {{$type}} format generated from Vaccine
        Model.</p>
@endif
<br/>
<p>For any technical assistance or support you can contact anytime with the AquaTools Team through our website. Thank
    you.</p>
@include('email.footer')
