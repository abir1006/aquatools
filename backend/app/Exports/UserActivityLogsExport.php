<?php

namespace App\Exports;

use App\Models\User;
use App\Models\UserActivity;

use App\Services\UserService;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;


use Config;



class UserActivityLogsExport implements FromCollection, WithHeadings
{

    private $filter_data;

    public function __construct($filter_data)
    {
        $this->filter_data = $filter_data;
    }

    /**
     * @inheritDoc
     */
    public function collection()
    {
        $logs = UserActivity::with('company');

        $user_service = new UserService(new User());
        $getCurrentUser = $user_service->getCurrentUser();
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            $logs = $logs->where('company_id', $company->id);
        }

        if ($this->filter_data) {
            if (isset($this->filter_data['company_id'])) {
                $logs = $logs->where('company_id', $this->filter_data['company_id']);
            }

            if (isset($this->filter_data['screen'])) {
                $logs = $logs->where('screen', $this->filter_data['screen']);
            }

            if (isset($this->filter_data['model'])) {
                $logs = $logs->where('screen', 'like', $this->filter_data['model'] . '%');
            }

            if (isset($this->filter_data['action_name'])) {
                $logs = $logs->where('type', 'like', $this->filter_data['action_name'] . '%');
            }

            if (isset($this->filter_data['start_date']) && isset($this->filter_data['end_date'])) {
                $start_date = date('Y-m-d', strtotime(str_replace('/', '-', $this->filter_data['start_date'])));
                $end_date = date('Y-m-d', strtotime(str_replace('/', '-', $this->filter_data['end_date'])));
                $logs = $logs->whereDate('created_at', '>=', $start_date);
                $logs = $logs->whereDate('created_at', '<=', $end_date);
            }
        }

        $logs = $logs->orderBy('created_at', Config::get('settings.pagination.order_by'))->get();

        $export = [];

        foreach ($logs as $log) {
            $export[] = array($log->id, isset($log->company) ? $log->company->name : '', 'Anonymous', $log->type, $log->screen, date("d/m/Y H:m:s", strtotime($log->created_at)) );
        }

        return collect($export);
    }

    /**
     * @inheritDoc
     */
    public function headings(): array
    {
        return ["ID", "Company", "User", "Action", "Screen", "Created"];
    }
}
