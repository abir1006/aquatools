@include('email.header')
<p>Hi {{$company->contact_person}},</p>
<br/>
<p>Your company agreement will end soon on {{ \Carbon\Carbon::parse($company->lastInvoice[0]->agreement_end_date)->format('d/m/Y')}} with AquaTools v2.0, to continue agreement, please contact Spillfree.</p>
<br/>
@include('email.footer')
