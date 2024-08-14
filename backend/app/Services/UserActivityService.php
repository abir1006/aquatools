<?php


namespace App\Services;

use App\Models\UserActivity;
use Illuminate\Support\Facades\Auth;
use Config;

class UserActivityService
{
    private $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function list()
    {
        $currentUser = $this->userService->getCurrentUser();
        return UserActivity::where('user_id', $currentUser->id);
    }

    public function logs($filter_data = false)
    {
        $logs = UserActivity::with('company');
        $getCurrentUser = $this->userService->getCurrentUser();
        $company = $getCurrentUser->company;
        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            $logs = $logs->where('company_id', $company->id);
        }

        if ($filter_data) {
            if (isset($filter_data['company_id'])) {
                $logs = $logs->where('company_id', $filter_data['company_id']);
            }

            if (isset($filter_data['screen'])) {
                $filter_str = $filter_data['screen'];

                if ($filter_data['screen'] == 'Models') {
                    $filter_str = 'model';
                }

                $logs = $logs->whereRaw('LOWER(screen) LIKE ? ', '%' . strtolower($filter_str) . '%');
            }

            if (isset($filter_data['model'])) {
                $logs = $logs->whereRaw('LOWER(screen) LIKE ? ', '%' . strtolower($filter_data['model']) . '%');
            }

            if (isset($filter_data['action_name'])) {
                $logs = $logs->whereRaw('LOWER(type) LIKE ? ', '%' . strtolower($filter_data['action_name']) . '%');
            }

            if (isset($filter_data['start_date']) && isset($filter_data['end_date'])) {
                $start_date = date('Y-m-d', strtotime(str_replace('/', '-', $filter_data['start_date'])));
                $end_date = date('Y-m-d', strtotime(str_replace('/', '-', $filter_data['end_date'])));
                $logs = $logs->whereDate('created_at', '>=', $start_date);
                $logs = $logs->whereDate('created_at', '<=', $end_date);
            }
        }

        return $logs->orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(20);
    }

    public function delete($id)
    {
        $currentUser = $this->userService->getCurrentUser();
        return UserActivity::where('id', $id)->where('user_id', $currentUser->id)->delete();
    }

    public function deleteLogs($options)
    {
        if ($options['delete_option'] == 1) {
            return UserActivity::destroy($options['id']);
        }

        if ($options['delete_option'] == 2) {
            $selected_data = date('Y-m-d', strtotime('-1 week', time()));
            return UserActivity::whereDate('created_at', '>', $selected_data)->delete();
        }

        if ($options['delete_option'] == 3) {
            $selected_data = date('Y-m-d', strtotime('-1 month', time()));
            return UserActivity::whereDate('created_at', '>', $selected_data)->delete();
        }

        if ($options['delete_option'] == 4) {
            $selected_data = date('Y-m-d', strtotime('-6 month', time()));
            return UserActivity::whereDate('created_at', '>', $selected_data)->delete();
        }

        if ($options['delete_option'] == 5) {
            return UserActivity::truncate();
        }
    }

}
