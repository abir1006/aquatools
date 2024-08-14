<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Template;
use App\Models\TemplateShare;
use App\Models\User;
use App\Notifications\NotifyUsersForTemplateUpdate;
use Config;
use DB;
use Illuminate\Support\Facades\Notification;

class TemplateService
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function notifyUsersForTemplateUpdate($template)
    {
        $sharedUsers = TemplateShare::where('template_id', $template->id)->get(['user_id']);

        $users = [];
        foreach ($sharedUsers as $user) {
            $users[] = $user['user_id'];
        }

        if ($template->updated_by != $template->user_id) {
            $users[] = $template->user_id;
        }

        $notifyUsers = $this->userService->getUsersByID($users);

        Notification::send($notifyUsers, new NotifyUsersForTemplateUpdate($template));
    }
    public function rename($id, $name)
    {

        $template = Template::find($id);
        $template->name = $name;
        $template->updated_by = $this->userService->getLoggedInUser()->id;
        $template->save();

        $this->notifyUsersForTemplateUpdate($template);

        return $template;
    }

    public function import($template)
    {
        $name = $template['name'];
        unset($template['id']);
        unset($template['name']);

        return Template::updateOrCreate(
            ['name' => $name],
            $template
        );
    }
    public function list($data)
    {
        $tool_id = $data['tool_id'];
        $user_id = $data['user_id'];
        return Template::where('tool_id', $tool_id)
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function sharedTemplateList($data)
    {
        $tool_id = $data['tool_id'];
        $user_id = $data['user_id'];

        return Template::where('tool_id', $tool_id)
            ->whereHas(
                'templateShares',
                function ($q) use ($user_id) {
                    $q->where('user_id', $user_id)
                        ->where('is_remove', 0);
                }
            )
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function listAllTools($data)
    {
        $user_id = $data['user_id'];

        return Template::with('templateShares', 'user', 'tool')
            ->where('user_id', $user_id)
            ->orWhereHas(
                'templateShares',
                function ($q) use ($user_id) {
                    $q->where('user_id', $user_id)
                        ->where('is_remove', 0);
                }
            )
            ->orderBy('created_at', 'desc')
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function search($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        $user_id = $data['user_id'];

        return Template::with('templateShares', 'user', 'tool')
            ->where('user_id', $user_id)
            ->orWhereHas(
                'templateShares',
                function ($q) use ($user_id) {
                    $q->where('user_id', $user_id)
                        ->where('is_remove', 0);
                }
            )
            ->where(
                function ($query) use ($search) {
                    $query->where('name', 'iLIKE', "%{$search}%");
                }
            )
            ->orWhereHas(
                'tool',
                function ($query) use ($search) {
                    $query->where('name', 'iLIKE', "%{$search}%");
                }
            )
            ->orWhereHas(
                'user',
                function ($query) use ($search) {
                    $query->where('email', 'iLIKE', "%{$search}%");
                }
            )
            ->orderBy($sort_by, $sort_type)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function save($data)
    {
        $template = Template::create($data);
        return Template::find($template->id);
    }

    public function update($data)
    {
        $id = $data['id'];
        Template::findOrFail($id)->update($data);
        return Template::find($id);
    }

    public function delete($id)
    {
        Template::findOrFail($id);
        return Template::destroy($id);
    }

    public function removeShare($id)
    {
        TemplateShare::findOrFail($id);
        return TemplateShare::destroy($id);
    }

    public function share($data)
    {
        $id = $data['template_id'];
        $template = Template::findOrFail($id);
        $getCurrentUser = $this->userService->getCurrentUser();

        if ($data['share_type'] === 'specific_users') {
            // set current logged user id as shared by id
            foreach ($data['users'] as $key => $v) {
                $data['users'][$key]['shared_by'] = $getCurrentUser->id;
                $data['users'][$key]['write_access'] = $data['write_access'];
            }
            $template->templateShares()->createMany($data['users']);
        }

        if ($data['share_type'] === 'all_users') {
            $request_data['template_id'] = $id;
            if (isset($data['company_id'])) {
                $request_data['company_id'] = $data['company_id'];
            }
            $sharable_user_list = $this->userList($request_data)->get()->toArray();
            $users_data = [];
            foreach ($sharable_user_list as $user) {
                $users_data[] = [
                    'user_id' => $user['id'],
                    'shared_by' => $getCurrentUser->id, // set current logged user id as shared by id
                    'write_access' => $data['write_access'],
                ];
            }

            $template->templateShares()->createMany($users_data);
        }

        return $template;
    }

    public function userList($data)
    {
        $template_id = $data['template_id'];

        // get selected template's model ID
        $selected_template = $this->getTemplateByID($template_id);
        $tool_id = $selected_template['tool_id'];

        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;
        $company_id = $getCurrentUser->company->id;

        if (isset($data['company_id'])) {
            $company_id = $data['company_id'];
        }

        if (Config::get(
            'settings.permission.super_admin_slug'
        ) != $getCurrentUser->roles[0]->slug || isset($data['company_id'])) {
            return User::with('company', 'company.tools')
                ->where('id', '!=', $user_id)
                ->where('company_id', $company_id)
                ->whereHas('company.tools', function ($q) use ($tool_id) {
                    $q->where('tool_id', $tool_id);
                })
                ->whereNotIn(
                    'id',
                    function ($query) use ($template_id) {
                        $query->select('user_id')
                            ->where('template_id', $template_id)
                            ->from('template_shares');
                    }
                )
                // ignore template created user
                ->whereNotIn(
                    'id',
                    function ($query) use ($template_id) {
                        $query->select('user_id')
                            ->where('id', $template_id)
                            ->from('templates');
                    }
                )
                ->orderBy('created_at', 'desc');
        }

        return User::with('company', 'company.tools')
            ->where('id', '!=', $user_id)
            ->whereHas('company.tools', function ($q) use ($tool_id) {
                $q->where('tool_id', $tool_id);
            })
            ->whereNotIn(
                'id',
                function ($query) use ($template_id) {
                    $query->select('user_id')
                        ->where('template_id', $template_id)
                        ->from('template_shares');
                }
            )
            ->whereNotIn(
                'id',
                function ($query) use ($template_id) {
                    $query->select('user_id')
                        ->where('id', $template_id)
                        ->from('templates');
                }
            )
            ->orderBy('created_at', 'desc');
    }


    public function userListSearch($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        $template_id = $data['template_id'];

        // get selected template's model ID
        $selected_template = $this->getTemplateByID($template_id);
        $tool_id = $selected_template['tool_id'];

        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            return User::with('company', 'company.tools')
                ->where('id', '!=', $user_id)
                ->where('company_id', $company->id)
                ->whereHas('company.tools', function ($q) use ($tool_id) {
                    $q->where('tool_id', $tool_id);
                })
                ->whereNotIn(
                    'id',
                    function ($query) use ($template_id) {
                        $query->select('user_id')
                            ->where('template_id', $template_id)
                            ->from('template_shares');
                    }
                )
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
                            );
                    }
                )
                ->orderBy('created_at', 'desc')
                ->paginate(Config::get('settings.pagination.per_page'));
        }

        return User::with('company', 'company.tools')
            ->where('id', '!=', $user_id)
            ->whereHas('company.tools', function ($q) use ($tool_id) {
                $q->where('tool_id', $tool_id);
            })
            ->whereNotIn(
                'id',
                function ($query) use ($template_id) {
                    $query->select('user_id')
                        ->where('template_id', $template_id)
                        ->from('template_shares');
                }
            )
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
                        );
                }
            )
            ->orderBy($sort_by, $sort_type)
            ->paginate(Config::get('settings.pagination.per_page'));
    }


    public function ownTemplateList($data)
    {
        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;

        $sortOrder = isset($data['sortOrder']) ? $data['sortOrder'] : 'desc';

        return Template::with('user', 'tool')
            ->where('user_id', $user_id)
            ->orderBy('created_at', $sortOrder)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function ownTemplateListSearch($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;

        return Template::with('user', 'tool')
            ->where('user_id', $user_id)
            ->where(
                function ($q) use ($search) {
                    $q->where('name', 'iLIKE', "%{$search}%")
                        ->orWhereHas(
                            'tool',
                            function ($query) use ($search) {
                                $query->where('name', 'iLIKE', "%{$search}%");
                            }
                        );
                }
            )
            ->orderBy($sort_by, $sort_type)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function sharedWithMeTemplateList($data)
    {
        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;

        $sortOrder = isset($data['sortOrder']) ? $data['sortOrder'] : 'desc';

        return TemplateShare::with('template', 'template.tool', 'template.user', 'sharedBy', 'template.user.company')
            ->where('user_id', $user_id)
            ->where('is_remove', 0)
            ->orderBy('created_at', $sortOrder)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function sharedWithMeTemplateListSearch($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;

        return TemplateShare::with('template', 'template.tool', 'template.user', 'template.user.company', 'sharedBy')
            ->where('user_id', $user_id)
            ->where('is_remove', 0)
            ->where(
                function ($q) use ($search) {
                    $q->whereHas(
                        'template',
                        function ($query) use ($search) {
                            $query->where('name', 'iLIKE', "%{$search}%");
                        }
                    )->orWhereHas(
                        'template.tool',
                        function ($query) use ($search) {
                            $query->where('name', 'iLIKE', "%{$search}%");
                        }
                    )->orWhereHas(
                        'sharedBy',
                        function ($query) use ($search) {
                            $query->where('first_name', 'iLIKE', "%{$search}%")
                                ->orWhere('last_name', 'iLIKE', "%{$search}%");
                        }
                    );
                }
            )
            ->orderBy($sort_by, $sort_type)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function sharedByMeTemplateList($data)
    {
        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;

        // now find shared templates with shared_by column
        $sortOrder = isset($data['sortOrder']) ? $data['sortOrder'] : 'desc';
        return TemplateShare::with('template', 'template.tool', 'user', 'user.company')
            ->where('shared_by', $user_id)
            ->orderBy('created_at', $sortOrder)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function sharedByMeTemplateListSearch($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        $getCurrentUser = $this->userService->getCurrentUser();
        $user_id = $getCurrentUser->id;

        return TemplateShare::with('template', 'template.tool', 'user', 'user.company')
            ->where('shared_by', $user_id)
            ->where(
                function ($q) use ($search) {
                    $q->whereHas(
                        'template',
                        function ($query) use ($search) {
                            $query->where('name', 'iLIKE', "%{$search}%");
                        }
                    )->orWhereHas(
                        'template.tool',
                        function ($query) use ($search) {
                            $query->where('name', 'iLIKE', "%{$search}%");
                        }
                    )->orWhereHas(
                        'user',
                        function ($query) use ($search) {
                            $query->where('first_name', 'iLIKE', "%{$search}%")
                                ->orWhere('last_name', 'iLIKE', "%{$search}%");
                        }
                    );
                }
            )
            ->orderBy($sort_by, $sort_type)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function allSavedTemplateList($data)
    {

        $getCurrentUser = $this->userService->getCurrentUser();
        $company = $getCurrentUser->company;

        $sortOrder = isset($data['sortOrder']) ? $data['sortOrder'] : 'desc';

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            return Template::with('user', 'user.company', 'tool')
                ->whereHas(
                    'user',
                    function ($q) use ($company) {
                        $q->where('company_id', $company->id);
                    }
                )
                ->orderBy('created_at', $sortOrder)
                ->paginate(Config::get('settings.pagination.per_page'));
        }

        return Template::with('user', 'user.company', 'tool')
            ->orderBy('created_at', $sortOrder)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function allSavedTemplateListSearch($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = Config::get('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        $getCurrentUser = $this->userService->getCurrentUser();
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.super_admin_slug') != $getCurrentUser->roles[0]->slug) {
            return Template::with('user', 'user.company', 'tool')
                ->whereHas(
                    'user',
                    function ($q) use ($company) {
                        $q->where('company_id', $company->id);
                    }
                )
                ->where(
                    function ($q) use ($search) {
                        $q->where('name', 'iLIKE', "%{$search}%")
                            ->orWhereHas(
                                'tool',
                                function ($query) use ($search) {
                                    $query->where('name', 'iLIKE', "%{$search}%");
                                }
                            )
                            ->orWhereHas(
                                'user',
                                function ($query) use ($search) {
                                    $query->where('first_name', 'iLIKE', "%{$search}%")
                                        ->orWhere('last_name', 'iLIKE', "%{$search}%");
                                }
                            );
                    }
                )
                ->orderBy($sort_by, $sort_type)
                ->paginate(Config::get('settings.pagination.per_page'));
        }

        return Template::with('user', 'user.company', 'tool')
            ->where('name', 'iLIKE', "%{$search}%")
            ->orWhereHas(
                'tool',
                function ($query) use ($search) {
                    $query->where('name', 'iLIKE', "%{$search}%");
                }
            )
            ->orWhereHas(
                'user',
                function ($query) use ($search) {
                    $query->where('first_name', 'iLIKE', "%{$search}%")
                        ->orWhere('last_name', 'iLIKE', "%{$search}%");
                }
            )
            ->orderBy($sort_by, $sort_type)
            ->paginate(Config::get('settings.pagination.per_page'));
    }

    public function templateListDropdown($data)
    {
        $currentUser = $this->userService->getCurrentUser();

        $result = [];
        $tool_id = $data['tool_id'];
        $user_id = $data['user_id'];

        $own_templates = Template::where('tool_id', $tool_id)
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($own_templates as $key => $value) {
            $result['Own'][$key]['id'] = $value->id;
            $result['Own'][$key]['name'] = $value->name;
            $result['Own'][$key]['template_data'] = $value->template_data;
            $result['Own'][$key]['user_id'] = $value->user_id;
        }

        $shared_templates = TemplateShare::with('template')
            ->where('user_id', $user_id)
            ->where('is_remove', 0)
            ->whereHas(
                'template',
                function ($q) use ($tool_id) {
                    $q->where('tool_id', '=', $tool_id);
                }
            )
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($shared_templates as $key => $value) {
            $result['Shared'][$key]['id'] = $value->template->id;
            $result['Shared'][$key]['name'] = $value->template->name;
            $result['Shared'][$key]['template_data'] = $value->template->template_data;
            $result['Shared'][$key]['write_access'] = $value->write_access;
        }

        //.........super admin & company admin part start..........
        $getCurrentUser = $this->userService->getCurrentUser();
        $company = $getCurrentUser->company;

        if (Config::get('settings.permission.company_admin_slug') == $getCurrentUser->roles[0]->slug) {
            $company_saved_templates = Template::select('id', 'name', 'template_data')
                ->where('tool_id', $tool_id)
                ->where('user_id', '!=', $currentUser->id)
                ->whereHas(
                    'user',
                    function ($q) use ($company) {
                        $q->where('company_id', $company->id);
                    }
                )
                ->orderBy('created_at', 'desc')
                ->get();

            if ($company_saved_templates->isNotEmpty()) {
                $result[$company->name] = $company_saved_templates;
            }
        }

        if (Config::get('settings.permission.super_admin_slug') == $getCurrentUser->roles[0]->slug) {
            $companies = Company::all();
            foreach ($companies as $key => $company) {
                $company_saved_templates = Template::select('id', 'name', 'template_data')
                    ->where('tool_id', $tool_id)
                    ->where('user_id', '!=', $currentUser->id)
                    ->whereHas(
                        'user',
                        function ($q) use ($company) {
                            $q->where('company_id', $company->id);
                        }
                    )
                    ->orderBy('created_at', 'desc')
                    ->get();

                if ($company_saved_templates->isNotEmpty()) {
                    $result[$company->name] = $company_saved_templates;
                }
            }
        }
        //.........super admin & company admin part end..........
        return $result;
    }

    /**
     * @return mixed
     */
    public function countTotalTemplates()
    {
        $currentUser = $this->userService->getCurrentUser();
        if ($currentUser->roles[0]->slug !== Config::get('settings.permission.super_admin_slug')) {
            return Template::whereHas(
                'user',
                function ($q) use ($currentUser) {
                    $q->where('company_id', $currentUser->company->id);
                }
            )->count();
        }
        return Template::count();
    }

    public function getTemplateByID($id)
    {
        return Template::find($id);
    }
}
