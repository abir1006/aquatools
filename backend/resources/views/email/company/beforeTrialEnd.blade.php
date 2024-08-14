@include('email.header')
<p>Hi {{$company->contact_person}},</p>
<br/>
<p>Your company trial period will end soon on {{ \Carbon\Carbon::parse($company->lastInvoice[0]->agreement_end_date)->format('d/m/Y')}} with AquaTools v2.0. To update your agreement, please contact Spillfree.</p>
<br/>
@include('email.footer')
