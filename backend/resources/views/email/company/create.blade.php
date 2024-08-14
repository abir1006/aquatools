@include('email.header')
<p>Hi {{$company->contact_person}},</p>
<br/>
<p>Welcome! Thank you for joining AquaTools v2.0</p>
<p>Your company has been added to our user list group.</p>

@if($company->user_create == 1)
    <br/>
    <p>Here is the login detail for the admin account to get access to AquaTools:</p>
    <br/>
    <p>AquaTools v2.0 URL: <a href="{{URL::to('/').'/admin/login'}}"> {{URL::to('/').'/admin/login'}}</a></p>
    <p>Username: {{$company->email}}</p>
    <p>Password: {{$password}}</p>
@endif

<br/>
<p>SpillFree will contact you soon for further orientation of the tool and follow up. You also can contact anytime with
    the AquaTools team through our website.</p>
@include('email.footer')
