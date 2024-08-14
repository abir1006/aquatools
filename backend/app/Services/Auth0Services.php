<?php


namespace App\Services;


use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class Auth0Services
{

    public function __construct()
    {
    }

    public static function getUserInfo($external_id)
    {
        if (Cache::has($external_id)) {
            $user_data['email'] = Crypt::decrypt(Cache::get($external_id)['email']);
            $user_data['name'] = Crypt::decrypt(Cache::get($external_id)['name']);
            return $user_data;
        }

        $auth_domain = env('AUTH0_DOMAIN');
        $response = Http::withToken(self::getAuth0ManagementAccessToken())
            ->get("https://$auth_domain/api/v2/users/$external_id");

        $user_data['email'] = isset($response['email']) ? trim($response['email']) : '';
        $user_data['name'] = isset($response['name']) ? trim($response['name']) : '';

        // Storing data in cache as encrypted
        $user['email'] = isset($response['email']) ? Crypt::encrypt(trim($response['email'])) : '';
        $user['name'] = isset($response['name']) ? Crypt::encrypt(trim($response['name'])) : '';
        Cache::put($external_id, $user, now()->addHours(24));
        return $user_data;
    }

    public static function getAuth0ManagementAccessToken()
    {
        if (Cache::has('auth0_management_token')) {
            return Cache::get('auth0_management_token');
        }

        $payload = [
            'grant_type' => 'client_credentials',
            'client_id' => env('AUTH_MANAGMENT_API_CLIENT_ID'),
            'client_secret' => env('AUTH_MANAGMENT_API_CLIENT_SECRET'),
            'audience' => env('AUTH_MANAGMENT_API_AUDIENCE')
        ];
        $headers = ['content-type' => "application/json"];
        $auth_domain = env('AUTH0_DOMAIN');
        $url = "https://$auth_domain/oauth/token";
        $response = Http::withHeaders($headers)->post($url, $payload);
        if (!$response) {
            return '';
        }

        Cache::put('auth0_management_token', $response["access_token"], now()->addSeconds($response["expires_in"]));
        return $response["access_token"];
    }

}

//def getUserDetailsFromAuth0(sup):
//    request = RequestMiddleware(get_response=None)
//    request = request.thread_local.current_request
//    bearer = request.META['HTTP_AUTHORIZATION'].split()
//    token = bearer[1]
//    url = 'https://login.toolbox.spillfree.no/userinfo'
//    headers = {"Authorization": "Bearer "+token}
//    user = requests.get(url=url, headers=headers).json()
//    return user
//
//
//def get_auth0_managment_token():
//
//    client_id = settings.AUTH_MANAGMENT_API_CLIENT_ID
//    client_secret = settings.AUTH_MANAGMENT_API_CLIENT_SECRET
//    audience = settings.AUTH_MANAGMENT_API_AUDIENCE
//    auth0_domain = settings.AUTH0_DOMAIN
//
//    payload = {
//    'grant_type': 'client_credentials',
//        'client_id': client_id,
//        'client_secret': client_secret,
//        'audience': audience
//    }
//
//    headers = {'content-type': "application/x-www-form-urlencoded"}
//    url = "https://{auth0_domain}/oauth/token".format(
//            auth0_domain=auth0_domain)
//
//    response = requests.post(url, data=payload, headers=headers)
//
//    return response.json()


//def get_auth0_management_token():
//    cache_key = 'auth0_token'
//    token = cache.get(cache_key, False)
//    if not token:
//        token = utils.get_auth0_managment_token()
//        cache.set(cache_key, token, 60 * 60 * 24)
//
//    return token['access_token']