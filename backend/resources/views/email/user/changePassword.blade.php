@include('email.header')
    <p>Hi {{$name}},</p>
    <br />
    <p>Your password has been changed successfully. </p>
    <br />
    <p>Here is your newly changed password: <b>{{$new_password}}</b></p>
    <br />
    <p>For any technical assistance or support you can contact anytime with the AquaTools Team through our website.
        Thank you.
    </p>

@include('email.footer')
