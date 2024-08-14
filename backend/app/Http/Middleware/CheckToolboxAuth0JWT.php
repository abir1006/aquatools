<?php

namespace App\Http\Middleware;

use Auth0\Login\Contract\Auth0UserRepository;
use Auth0\SDK\Exception\CoreException;
use Auth0\SDK\Exception\InvalidTokenException;
use Closure;

class CheckToolboxAuth0JWT
{
    protected $userRepository;

    /**
     * CheckJWT constructor.
     *
     * @param Auth0UserRepository $userRepository
     */
    public function __construct(Auth0UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $auth0 = app()->make('auth0');

        $accessToken = $request->bearerToken();
        if (!$accessToken)
            return response()->json(["message" => "Unauthorized user"], 401);

        try {
            $tokenInfo = $auth0->decodeJWT($accessToken);
            if (!$tokenInfo) {
                return response()->json(["message" => "Unauthorized user"], 401);
            }
        } catch (InvalidTokenException $e) {
            return response()->json(["message" => $e->getMessage()], 401);
        } catch (CoreException $e) {
            return response()->json(["message" => $e->getMessage()], 401);
        }

        return $next($request);
    }
}
