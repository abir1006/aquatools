<?php


namespace App\Services;

use App\Models\Role_User;
use App\Models\User;
use App\Models\Company;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Config;
use Kodeine\Acl\Models\Eloquent\Role;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;

class UserService
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function isAuthUserCompanyActive()
    {
        return User::whereHas(
            'company',
            function ($query) {
                $query->where('status', 1);
            }
        )->where('status', 1)->find(Auth::id());
    }

    public function getCurrentUser()
    {
        return User::with(
            'company',
            'roles',
            'roles.permissions',
            'company.tools',
            'company.tools.tool',
            'company.addons',
            'company.addons.addon',
            'company.lastInvoice',
            'company.lastInvoice.invoiceDetails'
        )->find(Auth::id());
    }

    public function getLoggedInUser(): User
    {
        return Auth::user();
    }

    public function getCurrentUserProfile()
    {
        $user = User::find(Auth::id());
        $user = $user->toArray();
        return $user;
    }

    public function insertResetPasswordToken($arr)
    {
        return PasswordReset::create($arr);
        //  return DB::table('password_resets')->insert($arr);

    }

    public function getUserByID($id)
    {
        return User::findOrFail($id);
    }


    public function getUserByCompanyID($company_id)
    {
        return User::where('company_id', $company_id)->pluck('id')->toArray();
    }

    public function getUsersByID($user_ids = [])
    {
        return User::whereIn('id', $user_ids)->get();
    }

    public function all()
    {
        return User::with('company', 'company.invoices' , 'company.invoices.invoiceDetails', 'company.lastInvoice' , 'company.lastInvoice.invoiceDetails', 'roles');
    }

    public function list()
    {
        $getCurrentUser = $this->getCurrentUser();
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            return User::with('company', 'roles')
                ->where('company_id', $company->id);
        }

        return User::with('company', 'roles');
    }

    public function listAll()
    {
        $getCurrentUser = $this->getCurrentUser();
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            return User::select('id', 'first_name', 'last_name', 'email')->where('company_id', $company->id);
        }

        return User::select('id', 'first_name', 'last_name', 'email');
    }

    public function listSort($data)
    {
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        //print_r($sort_by);
        //print_r($sort_type);
        //exit;

        $getCurrentUser = $this->getCurrentUser();
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            return User::with('company', 'roles')
                ->where('company_id', $company->id)
                ->orderByRaw('LOWER(' . $sort_by . ') ' . $sort_type) // to fix case sensitive
                //->orderBy($sort_by, $sort_type)
                ->paginate(Config::get('settings.pagination.per_page'));
        }

        $users = User::with('company', 'roles');
        if ($sort_by === 'company_name') {
            $users = $users->orderBy(
                Company::select('name')->whereColumn('companies.id', 'users.company_id'),
                $sort_type
            );
        } else {
            if ($sort_by === 'role') {
                $users = $users->orderBy(
                    Role_User::select('id')->whereColumn('role_user.user_id', 'users.id'),
                    $sort_type
                );
            } else if ($sort_by == 'created_at' || $sort_by == 'id' || $sort_by == 'status') {
                $users = $users->orderBy($sort_by, $sort_type);
            } else {
                $users = $users->orderByRaw('LOWER(' . $sort_by . ') ' . $sort_type); // to fix case sensitive;
                //$users = $users->orderBy($sort_by, $sort_type);
            }
        }
        $users = $users->paginate(Config::get('settings.pagination.per_page'));

        return $users;
    }

    public function search($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        //filters
        $filters = isset($data['filters']) ? $data['filters'] : [];

        $getCurrentUser = $this->getCurrentUser();
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            return User::with('company', 'roles')
                ->where('company_id', $company->id)
                ->where(
                    function ($q) use ($search) {
                        $q->where('first_name', 'iLIKE', "%{$search}%")
                            ->orWhere('last_name', 'iLIKE', "%{$search}%")
                            ->orWhere('email', 'iLIKE', "%{$search}%")
                            ->orWhereHas(
                                'company',
                                function ($query) use ($search) {
                                    $query->where('name', 'iLIKE', "%{$search}%");
                                }
                            )
                            ->orWhereHas(
                                'roles',
                                function ($query) use ($search) {
                                    $query->where('name', 'iLIKE', "%{$search}%");
                                }
                            );
                    }
                )->orderBy($sort_by, $sort_type)
                ->paginate(Config::get('settings.pagination.per_page'));
        }

        return User::with('company', 'roles')
            ->when(isset($filters['company']) && $filters['company'] != 'all', function ($q) use ($filters) {
                $q->where('company_id', $filters['company']);
            })
            ->where(
                function ($q) use ($search) {
                    $q->where('first_name', 'iLIKE', "%{$search}%")
                        ->orWhere('last_name', 'iLIKE', "%{$search}%")
                        ->orWhere('email', 'iLIKE', "%{$search}%")
                        ->orWhereHas(
                            'company',
                            function ($query) use ($search) {
                                $query->where('name', 'iLIKE', "%{$search}%");
                            }
                        )
                        ->orWhereHas(
                            'roles',
                            function ($query) use ($search) {
                                $query->where('name', 'iLIKE', "%{$search}%");
                            }
                        );
                }
            )->orderBy($sort_by, $sort_type)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function save($data)
    {
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        $data['user_id'] = $user->id;
        Role_User::create($data);

        // return Role_User::with('user', 'role', 'user.company')->where('user_id', $user->id)->first();
        return User::with('company', 'roles')->where('id', $user->id)->first();
    }

    public function update($data)
    {
        $id = $data['id'];
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        User::findOrFail($id)->update($data);

        // If this user is company contact person then update company contact person's first name and last name too
        if (!isset($data['from_company_screen'])) {
            Company::where('email', $data['email'])->update(
                array(
                    'contact_person' => $data['first_name'],
                    'contact_person_last_name' => $data['last_name']
                )
            );
        }

        $role_user_data['role_id'] = $data['role_id'];
        Role_User::where('user_id', $id)->update($role_user_data);

        return User::with('company', 'roles')->where('id', $id)->first();
    }

    public function delete($id)
    {
        Role_User::where('user_id', $id)->delete();
        return User::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $user = User::findOrFail($id);
        $user->status = $status;
        $user->save();

        return $user;
    }

    public function changePassword($data)
    {
        $id = $data['id'];
        $user = User::findOrFail($id);
        $user->password = bcrypt($data['password']);
        return $user->save();
    }

    public function changeResetPassword($data)
    {
        $email = $data['email'];
        $userObject = User::where('email', '=', $email)->firstOrFail();
        $user = User::findOrFail($userObject->id);
        $user->password = bcrypt($data['password']);
        return $user->save();
    }

    public function userChangePassword($data)
    {
        $userObject = User::where('id', '=', $data['id'])->firstOrFail();
        $userObject->password = bcrypt($data['new_password']);
        return $userObject->save();
    }

    /**
     * @return mixed
     */
    public function countTotalUsers()
    {
        $currentUser = $this->getCurrentUser();

        if ($currentUser->roles[0]->slug !== Config::get('settings.permission.super_admin_slug')) {
            return User::where('company_id', $currentUser->company->id)->count();
        }

        return User::count();
    }

    /**
     * @return mixed
     */
    public function countCompanyAdmins()
    {
        return User::with('Role')->whereHas(
            'roles',
            function ($q) {
                $q->where('slug', '=', 'company_admin');
            }
        )->count();
    }

    public function lastLoginTime()
    {
        $login = Auth::user()->only('last_login_at');
        return $login['last_login_at'];
    }


    public function getUserByEmail($email)
    {
        // return User::where('email', '=', $email)->firstOrFail();
        // return User::where('email', '=', $email)->first();
        return [];
    }

    public function checkVerificationCodeValidation($credentials)
    {
        $password_reset = PasswordReset::where('email', '=', $credentials['email'])
            ->latest()
            ->first();

        if ((!$password_reset) || ($password_reset->token != $credentials['verification_code'])) {
            return;
        }
        return $password_reset;
    }

    public function checkVerified($email)
    {
        //  return PasswordReset::select('status')
        return PasswordReset::where('email', '=', $email)
            ->latest()
            ->first();
    }

    public function checkUnverifiedToken($email)
    {
        return PasswordReset::where('email', '=', $email)
            ->where('status', '=', 0)
            ->latest()
            ->first();
    }

    public function updateVerificationCodeValidation($email, $status = 1)
    {
        $verified_code = PasswordReset::where('email', '=', $email)
            ->latest()
            ->first();
        $verified_code->status = $status;
        return $verified_code->save();
    }

    public function deleteTokenByEmail($email, $status = null)
    {
        $query = PasswordReset::query();

        if ($status) {
            $query = $query->where('status', '=', $status);
        }
        $query = $query->where('email', $email);
        $query->delete();;
    }

    public function checkTokenExpired($startTime)
    {
        $startTime = Carbon::parse($startTime);
        $currentTime = Carbon::now();
        $timeDifference = $currentTime->diffInSeconds($startTime);
        if ($timeDifference > 3600) {
            return true;
        }

        return false;
    }

    public function updateProfileInfo($data)
    {
        $id = $data['id'];
        $user = User::findOrFail($id);
        $user->update($data);

        // If this user is company contact person then update company contact person's first name and last name too
        Company::where('email', $data['email'])->update(
            array(
                'contact_person' => $data['first_name'],
                'contact_person_last_name' => $data['last_name']
            )
        );

        $user = $user->refresh();
        return $user;
    }

    public function fileUpload($file, $path)
    {
        $fileData = [];

        if ($file) {
            if (!File::isDirectory($path)) {
                File::makeDirectory($path, 0777, true, true);
            }

            $extension = $file->getClientOriginalExtension();
            $name = uniqid() . '_' . $file->getClientOriginalName();

            $file->move($path, $name);
            $fileData['file_type'] = $extension;
            $fileData['file_name'] = $name;
        }

        return $fileData;
    }

    public function updateProfilePic($data)
    {
        $id = $data['id'];
        $user = User::findOrFail($id);
        $user->profile_pic = $data['fileData']['file_name'];
        $user->save();
        $user = $user->refresh();
        return $user;
    }

    public function checkEmailChanged($data)
    {
        $id = $data['id'];
        $user = User::findOrFail($id);
        if ($user->email == $data['email']) {
            return false;
        }

        return true;
    }

    public function updateSingleField($data)
    {
        $id = $data['id'];
        $field_name = $data['field_name'];
        $field_value = $data['field_value'];
        $data_array[$field_name] = $field_value;
        User::findOrFail($id)->update($data_array);
        return User::with('company', 'roles')->where('id', $id)->first();
    }

    public function updateProfileInfoFromToolbox(){

            $data = request()->only('first_name','last_name','accept_cookie');
            try{
                if(User::where('email',request()->input('email'))->update($data)){
                    return response()->json([
                        'data' => [
                            'message' => 'update successful',
                            'status'=>'success'
                        ]
                    ]);
                }
                throw new \Exception('Something wrong');
            }
            catch(\Exception $e){
                return response()->json([
                    'data' => [
                        'message' => 'update failed',
                        'status'=>'failed'
                    ]
                ]);
            }     
    }

    public function updateProfileAvatarFromToolbox(){

        $data = request()->only('profile_pic');
        try{
            if(User::where('email',request()->input('email'))->update($data)){
                return response()->json([
                    'data' => [
                        'message' => 'update successful',
                        'status'=>'success'
                    ]
                ]);
            }
            throw new \Exception('Something wrong');
        }
        catch(\Exception $e){
            return response()->json([
                'data' => [
                    'message' => 'update failed',
                    'status'=>'failed',
                ]
            ]);
        }     
}
}
