@include('email.header')
<p>Hi {{$company->contact_person}},</p>
<br/>
@if($options['agreement_extended'] == true && $options['model_added'] == true)
    <p>Your company agreement has been updated with new model access - <b>{{$options['new_model_email_str']}}</b> and company agreement period has been updated to
        the new date <b>{{ \Carbon\Carbon::parse($company->lastInvoice[0]->agreement_end_date)->format('d/m/Y')}} </b> with AquaTools
        v2.0. Please contact Spillfree if you have any query.</p>
@endif

@if($options['agreement_extended'] == false && $options['model_added'] == true )
    <p>Your company agreement has been updated with new model access - <b>{{$options['new_model_email_str']}}</b>. Please contact Spillfree
        if you have any query.</p>
@endif

@if($options['agreement_extended'] == true && $options['model_added'] == false)
    <p>Your company agreement period has been updated to
        the new date <b> {{ \Carbon\Carbon::parse($company->lastInvoice[0]->agreement_end_date)->format('d/m/Y')}} </b> with AquaTools
        v2.0. Please contact Spillfree if you have any query.</p>
@endif

<br/>
@include('email.footer')
