<?php

namespace App\Http\Controllers;

use App\Mail\TestTemplate;
use App\Services\EmailService;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    private $email_service;
    public function __construct(EmailService $email_service)
    {
        $this->email_service = $email_service;
    }

    public function emailTest()
    {
        try {
            $this->email_service->at2SendEmail(
                '',
                'abir023048@gmail.com',
                'Template test',
                [],
                'email.template',
                []
            );
            print_r('Mail sent');
            exit;
        } catch (\Exception $e) {
            print_r($e->getMessage());
            exit;
        }


    }

    public function testTemplate()
    {
        return view('email.template');
    }

}
