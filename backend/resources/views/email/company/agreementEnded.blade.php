@include('email.header')
<p>Hi {{$company->contact_person}},</p>
<br/>
<p>Your company agreement has been ended with AquaTools v2.0. Thank you for being part of Spillfree.</p>
<br/>
@include('email.footer')
