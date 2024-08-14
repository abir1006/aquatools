<?php

namespace App\Http\Controllers;

use App\Events\CompanyModelUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\StatusUpdateRequest;
use App\Http\Requests\UserSingleFieldUpdateRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\UserProfileInfoUpdateRequest;
use App\Http\Requests\UserProfilePicUpdateRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\ChangeResetPasswordRequest;
use App\Http\Requests\UserPasswordUpdateRequest;
use App\Mail\AccountRemoved;
use App\Models\Company;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Services\CompanyService;
use App\Services\EmailService;
use App\Services\UserService;
use App\Services\MaterialService;
use Illuminate\Http\Request;
use Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

use function Doctrine\Common\Cache\Psr6\get;


class UserController extends Controller
{
    /**
     * @var UserService
     */

    private UserService $userService;
    private EmailService $emailService;
    private CompanyService $companyService;
    private MaterialService $materialService;
    private FileService $fileService;


    /**
     * UserController constructor.
     * @param UserService $userService
     * @param CompanyService $companyService
     * @param EmailService $emailService
     * @param MaterialService $materialService
     * @param FileService $fileService
     */
    public function __construct(
        UserService $userService,
        CompanyService $companyService,
        EmailService $emailService,
        MaterialService $materialService,
        FileService $fileService
    )
    {
        $this->userService = $userService;
        $this->companyService = $companyService;
        $this->emailService = $emailService;
        $this->materialService = $materialService;
        $this->fileService = $fileService;
    }

    /**
     * @return JsonResponse
     */
    public function all()
    {
        $users = $this->userService->all()->get();
        return response()->json($users, 200);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function list(Request $request)
    {
        $users = $this->userService->list($request->all());
        $users = $users->orderBy('created_at', Config::get('settings.pagination.order_by'))
            ->paginate(Config::get('settings.pagination.per_page'));

        return response()->json($users, 200);
    }

    public function listAll()
    {
        $users = $this->userService->listAll();
        $users = $users->orderBy('created_at', Config::get('settings.pagination.order_by'))->get();
        return response()->json($users, 200);
    }

    public function search(Request $request)
    {
        $users = $this->userService->search($request->all());
        return response()->json($users, 200);
    }

    public function listSort(Request $request)
    {
        $users = $this->userService->listSort($request->all());
        return response()->json($users, 200);
    }

    /**
     * @param UserStoreRequest $request
     * @return JsonResponse
     */
    public function store(UserStoreRequest $request)
    {
        $data = $request->all();

        $freeUser = 1; // Each company will get one free admin user
        $numberOfAllowedUsers = $this->companyService->numberOfAllowedUsers($data['company_id']);
        $numberOfAllowedUsers = $numberOfAllowedUsers + $freeUser;
        $numberOfRegisteredUsers = $this->companyService->numberOfRegisteredUsers($data['company_id']);

        // Check company user agreement before add new user
        // Send warning message
        // If number of registered users exceeded the agreement
        if ($numberOfRegisteredUsers >= $numberOfAllowedUsers) {
            return response()->json(
                [
                    'errors' => [0 => 'Number of registered users of this company exceeded the agreement. To add more users, update the agreement.'],
                    'message' => 'Failed to save user'
                ],
                404
            );
        }


        $user = $this->userService->save($request->all());

        //.......Email part start...............
        $emailSubject = 'AquaTools v2.0 - your user account created successfully';
        $emailTemplate = 'email.user.create';
        $files = [];

        $email_data = array(
            'user' => $user,
            'password' => $request->password,
            'link' => URL::to('/')

        );
        try {
            $this->emailService->at2SendEmail(
                '',
                $user->email,
                $emailSubject,
                $email_data,
                $emailTemplate,
                $files
            );
        } catch (\Exception $e) {
        }
        //.......Email part end...............

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $user
            ],
            201
        );
    }

    /**
     * @param UserUpdateRequest $request
     * @return JsonResponse
     */
    public function update(UserUpdateRequest $request)
    {
        $user = $this->userService->update($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $user
            ],
            200
        );
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function updateCookieConsent(UserSingleFieldUpdateRequest $request)
    {
        $user = $this->userService->updateSingleField($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $user
            ],
            200
        );
    }

    public function destroyUserByEmail(Request $request, $email)
    {
        $user_data = $this->userService->getUserByEmail($email);

        if (!$user_data)
            return response()->json(
                [
                    'message' => config('settings.message.not_found')
                ],
                404
            );


        $company_id = $user_data->company_id;

        $deleted = $this->userService->delete($user_data->id);

        if ($deleted == 0) {
            return response()->json(
                [
                    'message' => Config::get('settings.message.not_found')
                ],
                404
            );
        }

        CompanyModelUpdated::dispatch(Company::find($company_id));


        // Send email to user to confirm account removal
        //Mail::to($user_data->email)->send(new AccountRemoved());

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    /**
     * @param DeleteRequest $request
     * @return JsonResponse
     */
    public function destroy(DeleteRequest $request)
    {
        $user_data = $this->userService->getUserByID($request->id);

        $company_id = $user_data->company_id;

        $deleted = $this->userService->delete($request->id);

        if ($deleted == 0) {
            return response()->json(
                [
                    'message' => Config::get('settings.message.not_found')
                ],
                404
            );
        }

        CompanyModelUpdated::dispatch(Company::find($company_id));


        // Send email to user to confirm account removal
        //Mail::to($user_data->email)->send(new AccountRemoved());

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    /**
     * @param DeleteRequest $request
     * @return JsonResponse
     */
    public function changeStatus(StatusUpdateRequest $request)
    {
        $user = $this->userService->changeStatus($request->all());


        if ($request->status == 0) {
            $user = $this->userService->getUserByID($request->id);
            CompanyModelUpdated::dispatch(Company::find($user->company_id));
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.updated')
            ],
            200
        );
    }

    /**
     * @param ChangePasswordRequest $request
     * @return JsonResponse
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        $status = $this->userService->changePassword($request->all());


        //.......Password change email ...............
        $emailSubject = 'AquaTools v2.0 - Your password has been changed';
        $emailTemplate = 'email.user.changePasswordByAdmin';
        $files = [];

        $user = $this->userService->getUserByID($request->all()['id']);

        $email_data = array(
            'name' => $user->name(),
            'new_password' => $request->all()['password']
        );

        // notify user in email with new password
        $this->emailService->at2SendEmail(
            '',
            $user->email,
            $emailSubject,
            $email_data,
            $emailTemplate,
            $files
        );

        if ($status && Auth::user()['id'] === $request->all()['id']) {
            Auth::user()->token()->revoke();
            Auth::user()->token()->delete();
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $status
            ],
            200
        );
    }


    public function changeResetPassword(ChangeResetPasswordRequest $request)
    {
        //.......Password change email ...............
        $emailSubject = 'AquaTools v2.0 - Your password has been changed successfully';
        $emailTemplate = 'email.user.changePassword';
        $files = [];

        $user = $this->userService->getUserByEmail($request->email);


        $email_data = array(
            'name' => $user->name(),
            'new_password' => $request->all()['password']
        );


        $checkVerified = $this->userService->checkVerified($user->email);

        if (!$checkVerified || $checkVerified->status != 1) {
            return response()->json(["message" => "Your request is invalid"], 400);
        }


        $checkTokenExpired = $this->userService->checkTokenExpired($checkVerified->created_at);
        if ($checkTokenExpired) {
            return response()->json(
                ["message" => "Your password reset request time is already expired. Maximum Reset Time is 60 Minutes"],
                400
            );
        }

        // $this->userService->updateVerificationCodeValidation($user->email, 2);
        $status = $this->userService->changeResetPassword($request->all());

        // notify user in email with new password
        $this->emailService->at2SendEmail(
            '',
            $user->email,
            $emailSubject,
            $email_data,
            $emailTemplate,
            $files
        );

        $this->userService->deleteTokenByEmail($user->email);

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $status
            ],
            200
        );
    }

    public function forgot(Request $request)
    {
        $email = request()->validate(['email' => 'required|email']);
        $email = $email['email'];
        $user = $this->userService->getUserByEmail($email);
        $checkUnverified = $this->userService->checkUnverifiedToken($email);

        if ($checkUnverified) {
            return response()->json(
                [
                    'message' => "An unused code has been found for your account. enter previous code or request for new code",
                    'data' => [
                        'email' => $email,
                        'resend' => true
                    ]

                ],
                400
            );
        }


        //sent email
        $this->sendForgotPassEmail($user);

        return response()->json(
            [
                'message' => 'Thanks for your request, we sent verification code to your email. Please check your email',
                'data' => $email
            ],

            200
        );
    }

    private function sendForgotPassEmail($user)
    {
        //.......Password reset email ...............
        $emailSubject = 'AquaTools v2.0 - Verification code to reset your login password';
        $emailTemplate = 'email.user.resetPassword';

        $files = [];

        $token = Str::random(6);


        $email_data = array(
            'name' => $user->name(),
            'token' => $token
        );

        //create a new token to be sent to the user.
        $this->userService->insertResetPasswordToken(
            [
                'email' => $user->email,
                'token' => $token
            ]
        );

        // notify user in email with new password
        $this->emailService->at2SendEmail(
            '',
            $user->email,
            $emailSubject,
            $email_data,
            $emailTemplate,
            $files

        );
    }

    public function forgotResend(Request $request)
    {
        $email = request()->validate(['email' => 'required|email']);
        $email = $email['email'];
        $user = $this->userService->getUserByEmail($email);
        $checkUnverified = $this->userService->checkUnverifiedToken($email);

        if ($checkUnverified) {
            $this->userService->deleteTokenByEmail($email, 0);
        } else {
            return response()->json(['message' => "You are not permitted for password resent request",], 400);
        }


        //sent email
        $this->sendForgotPassEmail($user);


        return response()->json(
            [
                'message' => 'we resent verification code to your email. Please check your email',
                'data' => $email
            ],

            200
        );
    }


    public function resetVerifyCode(Request $request)
    {
        $credentials = request()->validate(
            [
                'email' => 'required|email',
                'verification_code' => 'required|string',
            ]
        );

        $token_object = $this->userService->checkVerificationCodeValidation($credentials);

        // $user = $this->userService->getUserByEmail($credentials['email']);

        if (!isset($token_object)) {
            return response()->json(["message" => "Your Provided Email or Verification Code is not Correct"], 400);
        } else {
            if ($token_object->status == 1) {
                return response()->json(["message" => "Your code is already verified previously"], 400);
            }

            $checkTokenExpired = $this->userService->checkTokenExpired($token_object->created_at);
            if ($checkTokenExpired) {
                return response()->json(
                    ["message" => "Your password reset request time is already expired. Maximum Reset Time is 60 Minutes"],
                    400
                );
            }
        }

        $this->userService->updateVerificationCodeValidation($credentials['email'], 1);

        return response()->json(
            [
                'message' => 'Your verification code is matched successfully',
                'data' => $credentials['email']
            ],
            200
        );
    }

    private function isExpired($dateStr)
    {
        $date = \DateTime::createFromFormat('d/m/Y', $dateStr);
        return strtotime(date('Y-m-d')) > strtotime($date->format('Y-m-d'));
    }


    /**
     * @return JsonResponse
     */
    public function details()
    {
        $permitted_tools = [];
        $permitted_addons = [];

        $isAuthUserCompanyActive = $this->userService->isAuthUserCompanyActive();

        if (!$isAuthUserCompanyActive) {
            return response()->json(
                [
                    'status' => 'error',
                    'msg' => 'Error',
                    'errors' => [],
                ],
                422
            );
        }

        $user = $this->userService->getCurrentUser();

        // Find expired models from invoice details

        $excluded_expired_tools = [];


        if (isset($user->company->lastInvoice[0])) {
            foreach ($user->company->lastInvoice[0]->invoiceDetails as $inv_details) {
                if ($inv_details['trial_end'] != '' && $this->isExpired($inv_details['trial_end'])) {
                    $excluded_expired_tools[] = $inv_details['item_slug'];
                }
            }
        }

        foreach ($user->company->tools as $key => $value) {
            array_push($permitted_tools, $value->tool->slug);
        }

        foreach ($user->company->addons as $key => $value) {
            array_push($permitted_addons, $value->addon->slug);
        }

        $permitted_tools = array_values(array_diff($permitted_tools, $excluded_expired_tools));

        $user = $user->toArray();
        $user['permitted_tools'] = $permitted_tools;

        $user['permitted_addons'] = $permitted_addons;

        return response()->json(['user' => $user], 200);
    }


    public function userProfileInfoView()
    {
        $user = $this->userService->getCurrentUserProfile();
        return response()->json(['data' => $user], 200);
    }

    public function userProfileInfoUpdate(UserProfileInfoUpdateRequest $request)
    {
        $emailSubject = 'AquaTools v2.0 - Your profile has been updated';
        $emailTemplate = 'email.user.changeUserProfile';
        $files = [];


        if ($this->userService->checkEmailChanged($request->all())) {
            return response()->json(
                [
                    'message' => 'Sorry!! You cannot change your email address',
                ],
                400
            );
        }

        $user = $this->userService->updateProfileInfo($request->all());

        if (empty($user)) {
            return response()->json(
                [
                    'message' => 'The given data was invalid.',
                ],
                400
            );
        }


        $email_data = array(
            'name' => $user->name(),
            'email_msg' => 'Your Profile Information Updated Successfully.',

        );


        // notify user in email with new password
        $this->emailService->at2SendEmail(
            '',
            $user->email,
            $emailSubject,
            $email_data,
            $emailTemplate,
            $files
        );

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $user
            ],
            200
        );
    }

    public function userPasswordUpdate(UserPasswordUpdateRequest $request)
    {
        //.......Password change email ...............
        $emailSubject = 'AquaTools v2.0 - Your password has been changed successfully';
        $emailTemplate = 'email.user.changePassword';
        $files = [];
        $data = $request->all();

        $user = $this->userService->getUserByID($data['id']);


        if (!Hash::check($data['password'], $user->password)) {
            return response()->json(
                [
                    'msg' => ['Your provided password is not matched with the system'],
                ],
                400
            );
        }

        $email_data = array(
            'name' => $user->name(),
            'new_password' => $request->all()['new_password']
        );

        $status = $this->userService->userChangePassword($data);

        // notify user in email with new password
        $this->emailService->at2SendEmail(
            '',
            $user->email,
            $emailSubject,
            $email_data,
            $emailTemplate,
            $files
        );


        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $status
            ],
            200
        );
    }

    public function userProfilePicUpdate(UserProfilePicUpdateRequest $request)
    {
        $requestData = $request->all();

        if ($request->hasFile('profile_pic')) {
            $file_name = $this->fileService->upload($request->file('profile_pic'), 'uploads/profile-pic/');
            $requestData['fileData'] = [
                'file_type' => $request->file('profile_pic')->getClientOriginalExtension(),
                'file_name' => $file_name
            ];
        }

        $user = $this->userService->updateProfilePic($requestData);
        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $user
            ],
            201
        );
    }

    public function logout()
    {
        return response()->json(
            [
                'message' => 'Successfully logout',
                'data' => []
            ],
            201
        );
    }

    public function updateProfileInfoFromToolbox()
    {
        return $this->userService->updateProfileInfoFromToolbox();
    }

    public function updateProfileAvatarFromToolbox()
    {
        return $this->userService->updateProfileAvatarFromToolbox();
    }
}
