<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password, 'status' => 1])) {
            $user = $request->user();
            $company = Company::find($user->company_id);

            if ($company->status === 0) {
                return response()->json(['error' => 'Unauthorized, Company blocked'], 401);
            }

            if (!isset($company->lastInvoice[0])) {
                return response()->json(['error' => 'Company agreement has expired, please contact with SpillFree'], 401);
            }

            $data['token'] = $user->createToken('AquaTools-2.0')->accessToken;
            $data['name'] = $user->first_name . ' ' . $user->last_name;
            return response()->json($data, 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }
}
