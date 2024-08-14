<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Services\UserService;


class EmailService
{
    private $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function at2SendEmail(
        $to_name,
        $to_email,
        $email_subject,
        $email_data,
        $email_template_name,
        $files,
        $to_cc = ''
    ) {
        Mail::send(
            $email_template_name,
            $email_data,
            function ($message) use ($to_name, $to_email, $email_subject, $files, $to_cc) {
                $message = $message->to($to_email, $to_name);
                if ($to_cc != '') {
                    $message = $message->cc($to_cc);
                }
                $message->subject($email_subject);

                // if have attachments
                if (count($files) > 0) {
                    foreach ($files as $file) {
                        $message->attach($file);
                    }
                }

                $message->from('no-reply@spillfree.no', 'Spillfree');
            }
        );
    }


    public function extractNameFromEmail($email)
    {
        $name = '';

        $user_data = $this->userService->getUserByEmail($email);

        if ($user_data) {
            $last_name = $user_data->last_name == null || $user_data->last_name == '' ? '' : ' ' . $user_data->last_name;
            $name = $user_data->first_name . $last_name;
        }

        if (trim($name) == '') {
            $name = ucfirst(explode("@", $email)[0]);
        }

        return $name;
    }

}
