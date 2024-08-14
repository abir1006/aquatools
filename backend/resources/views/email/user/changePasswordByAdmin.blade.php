@include('email.header')
<p>Hi {{$name}},</p>
<br/>
<p>Your password has been changed by the administrator.</p>
<br/>
<p>Here is your newly changed password: <b>{{$new_password}}</b></p>
<br/>
<p>For any technical assistance or support you can contact your administrator. Thank you.</p>
@include('email.footer')
