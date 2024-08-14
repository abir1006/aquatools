<?php


namespace App\Services;

use App\Models\FeedLibrary;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Config;


class FeedService
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function list()
    {
        $currentUser = $this->userService->getCurrentUser();
        $company_id = $currentUser->company->id;
        if (Config::get('settings.permission.super_admin_slug') != $currentUser->roles[0]->slug) {
            return FeedLibrary::where('company_id', $company_id)->orderBy(
                'created_at',
                Config::get('settings.pagination.order_by')
            )->get();
        }
        return FeedLibrary::orderBy('created_at', Config::get('settings.pagination.order_by'))->get();
    }

    public function save($data)
    {
        return FeedLibrary::create($data);
    }

    public function delete($id)
    {
        return FeedLibrary::destroy($id);
    }

    public function update($data)
    {
        $id = $data['id'];
        return FeedLibrary::findOrFail($id)->update($data);
    }
}
