@include('email.header')
<p>Hi {{$company->contact_person}},</p>
<br/>

<p>As per your company agreement, {{$invoice_details['item_name']}} model trial period will end
    on {{ $invoice_details['trial_end']. ' 23:59:59'}} with AquaTools v2.0. To
    continue access to the model, please update your agreement and contact with Spillfree.</p>
<br/>
@include('email.footer')
