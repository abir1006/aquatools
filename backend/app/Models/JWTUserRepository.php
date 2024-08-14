<?php

namespace App\Models;

use App\Models\User;
use App\Services\CompanyService;
use App\Services\UserService;
use Auth0\Login\Auth0User;
use Auth0\Login\Auth0JWTUser;
use Auth0\Login\Repository\Auth0UserRepository;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use Kodeine\Acl\Models\Eloquent\Role;

class JWTUserRepository extends Auth0UserRepository
{
    private $userService;
    private $companyService;

    public function __construct(CompanyService $companyService, UserService $userService)
    {
        $this->companyService = $companyService;
        $this->userService = $userService;
    }

    protected function findUser($profile)
    {
        $auth0_namespace = env('AUTH0_NAMESPACE');
        $external_id = $profile['sub'];
        $user = User::where('external_id', $external_id)->first();

        if (!$user && request()->path() == 'api/user/details') {

            // Find Auth0 Organization ID from token claim
            $auth0_organizations = $profile[$auth0_namespace]->organizations;
            if (count($auth0_organizations) == 0) {
                abort(response()->json([
                    'errors' => 'Auth0 Organizations ID not found',
                    'message' => 'Failed to fetch user'
                ], 404));
            }

            // Finding company from AT2 DB with Auth0 Org ID

            $company_id = false;
            foreach ($auth0_organizations as $orgs) {
                $company = Company::where('auth0_org_id', $orgs->id)->first();
                if ($company) {
                    $company_id = $company->id;
                    break;
                }
            }

            if (!$company_id) {
                abort(response()->json([
                    'errors' => ['Company not found'],
                    'message' => 'Failed to authenticate!'
                ], 404));
            }

            $data['company_id'] = $company_id;
            $data['role_id'] = Role::where('slug', 'company_user')->value('id');
            $freeUser = 1; // Each company will get one free admin user
            $numberOfAllowedUsers = $this->companyService->numberOfAllowedUsers($data['company_id']);
            $numberOfAllowedUsers = $numberOfAllowedUsers + $freeUser;
            $numberOfRegisteredUsers = $this->companyService->numberOfRegisteredUsers($data['company_id']);

            // Check company user agreement before add new user
            // Send warning message
            // If number of registered users exceeded the agreement
            if ($numberOfRegisteredUsers >= $numberOfAllowedUsers) {
                abort(response()->json([
                    'errors' => ['Number of registered users of this company exceeded the agreement. To add more users, update the agreement.'],
                    'message' => 'Failed to save user'
                ], 404));
            }

            $data['external_id'] = $profile['sub'];
            $data['password'] = bcrypt('Temp9876!');
            $this->userService->save($data);
            $user = User::where('external_id', $profile['sub'])->first();
        }

        // Login to system
        Auth::login($user);

        return $user; //auth()->user();
    }

    public function getUserByDecodedJWT(array $decodedJwt): Authenticatable
    {
        return $this->findUser($decodedJwt);
    }
}
