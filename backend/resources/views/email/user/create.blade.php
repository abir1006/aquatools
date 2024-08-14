@include('email.header')
<p>Hi {{trim($user->first_name).' '. trim($user->last_name)}},</p>

<br/>
<p>Welcome! Thank you for joining AquaTools v2.0</p>
<p>Your user account is created successfully and added to our user-list group.</p>

<br/>
<p>Here is the login detail for the your account to get access to AquaTools:</p>
<br/>
<p>AquaTools v2.0 URL: <a href="{{config('app.frontend_url')}}"> {{ config('app.frontend_url')  }}</a></p>
<p>Username: {{$user->email}}</p>
<p>Password: {{$password}}</p>

@include('email.footer')
