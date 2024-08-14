@include('email.header')
    <p>Hi {{$name}},</p>
    <br />
    <p>Someone has requested a password reset and here is the verification code:
    </p>
    <br />
    <p>Your verification code : <strong> {{$token}} </strong></p>
    <br>
    <p>If this was a mistake, just ignore this email and nothing will happen.</p>
    <br />
    <p>For any technical assistance or support you can contact anytime with the AquaTools Team through our website.
        Thank you.</p>

@include('email.footer')
