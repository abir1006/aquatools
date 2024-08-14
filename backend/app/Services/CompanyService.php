<?php

namespace App\Services;


use App\Models\Company;
use App\Models\Invoice;
use App\Models\Tool;
use App\Models\User;
use Carbon\Carbon;
use Kodeine\Acl\Models\Eloquent\Role;
use Config;

class CompanyService
{
    private $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function list($data)
    {
        // return Company::with('tools', 'addons', 'materials', 'invoices', 'invoices.invoiceDetails')->orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(Config::get('settings.pagination.per_page'));

        return Company::orderBy('created_at', Config::get('settings.pagination.order_by'))->paginate(
            Config::get('settings.pagination.per_page')
        );
    }

    public function search($data)
    {
        $search = null;
        $sort_by = 'created_at';
        $sort_type = config('settings.pagination.order_by');

        if (!empty($data['sort_by'])) {
            $sort_by = $data['sort_by'];
        }

        if (!empty($data['sort_type'])) {
            $sort_type = $data['sort_type'];
        }

        if (!empty($data['search'])) {
            $search = $data['search'];
        }

        //filters
        $filters = isset($data['filters']) ? $data['filters'] : [];

        return Company::when(isset($filters['company']) && $filters['company'] != 'all', function ($q) use ($filters) {
            $q->where('id', $filters['company']);
        })->where(function ($q) use ($search, $sort_by, $sort_type) {
            $q->where('name', 'iLIKE', "%{$search}%");
            $q->orWhere('email', 'iLIKE', "%{$search}%");
            $q->orWhere('contact_person', 'iLIKE', "%{$search}%");
            $q->orWhere('contact_number', 'iLIKE', "%{$search}%");
            $q->orderBy($sort_by, $sort_type);
        })->paginate(config('settings.pagination.per_page'));
    }

    public function listDetails($data)
    {
        return Company::with('tools', 'addons', 'materials', 'invoices', 'invoices.invoiceDetails')->orderBy(
            'created_at',
            Config::get('settings.pagination.order_by')
        )->paginate(Config::get('settings.pagination.per_page'));
    }

    public function listAll($data)
    {
        return Company::where('status', 1)->get(['id', 'name']);
    }

    public function listByToolAccess($data)
    {
        $tool_id = $data['tool_id'];
        return Company::with('tools')->whereHas('tools', function ($q) use ($tool_id) {
            $q->where('tool_id', $tool_id);
        })->where('status', 1)->get(['id', 'name']);
    }

    public function edit($data)
    {
        $id = $data['id'];
        $company = Company::with(
            'tools',
            'addons',
            'materials',
            'lastInvoice',
            'lastInvoice.invoiceDetails',
            'invoices',
            'invoices.invoiceDetails'
        )->where(
            'id',
            $id
        )->first();

        $agreement_end_date = null;
        $agreement_end = 0;

        // Get last invoice agreement date

        if (isset($company->lastInvoice[0])) {
            $agreement_end_date = $company->lastInvoice[0]->agreement_end_date;
        }

        $today = date('Y-m-d');

        // Check if company agreement expired
        if (strtotime($today) > strtotime($agreement_end_date)) {
            $agreement_end = 1;
        }

        $company = $company->toArray();
        $company['agreement_end'] = $agreement_end;

        return $company;
    }

    public function save($data)
    {

        try {
            $company = Company::create($data);
        } catch (\Illuminate\Database\QueryException $exception) {
            return false;
        }

        // Check if request came from Toolbox, then re-arrange tools array
        $company_tools = $data['company_tools'];
        if (!isset($company_tools[0]['tool_id'])) {
            $company_tools = [];
            foreach ($data['company_tools'] as $key => $item) {
                $company_tools[$key]['tool_id'] = Tool::where('slug', $item)->value('id') ;
            }
        }

        $company->tools()->createMany($company_tools);
        $company->addons()->createMany($data['company_addons']);
        $company->materials()->createMany($data['company_materials']);
        $invoice = $company->invoices()->create($data['invoices']);
        $invoice->invoiceDetails()->createMany($data['invoice_details']);

        if ($data['user_create'] == 1) {
            $role = Role::where('slug', 'company_admin')->first();

            $userData['company_id'] = $company['id'];
            $userData['role_id'] = $role->id;
            $userData['email'] = $company['email'];
            $userData['first_name'] = $company['contact_person'];
            $userData['last_name'] = $company['contact_person_last_name'];
            $userData['password'] = $data['password'];

            $this->userService->save($userData);
        }

        $company = Company::find($company['id']);

        return $company;
    }

    public function getCompanyByName($name)
    {
        return Company::where('name', '=', $name)->first();
    }

    public function update($data)
    {
        $id = $data['id'];
        $company = Company::with('lastInvoice', 'lastInvoice.invoiceDetails')->findOrFail($id);

        // reset email sending flag
        if (!isset($company->lastInvoice[0])) {
            $data['expire_email_sent'] = 0;
        }

        // Check current model trial expiry email sent status from invoice details and add the key to current request data
        if (isset($company->lastInvoice[0])) {
            foreach ($company->lastInvoice[0]->invoiceDetails as $inv_detail) {
                $model_slug = $inv_detail->item_slug;
                $is_email_sent = $inv_detail->expire_email_sent;
                array_walk(
                    $data['invoice_details'],
                    function (&$v) use ($model_slug, $is_email_sent) {
                        // take email sent flag from database if model has trial period
                        if ($v['item_slug'] == $model_slug && $v['unit_price'] == 0) {
                            $v['expire_email_sent'] = $is_email_sent;
                        }
                        // reset all trial period fields if model updated with new price
                        if ($v['item_slug'] == $model_slug && $v['unit_price'] > 0) {
                            $v['trial'] = null;
                            $v['expire_email_sent'] = 0;
                            $v['trial_start'] = null;
                            $v['trial_end'] = null;
                        }
                    }
                );
            }
        }

        $user = User::where('email', $data['email'])->first();
        $role = Role::where('slug', 'company_admin')->first();
        if (empty($user) && isset($data['user_create']) && $data['user_create'] == 1) {
            //.....create user.........
            $userData['company_id'] = $id;
            $userData['role_id'] = $role->id;
            $userData['email'] = $data['email'];
            $userData['first_name'] = $data['contact_person'];
            $userData['last_name'] = $data['contact_person_last_name'];
            $userData['password'] = $data['password'];
            $this->userService->save($userData);
        } elseif (!empty($user)) {
            $data['user_create'] = 1; // If user exist with company email, set company user create flag 1
            $userUpdateData['from_company_screen'] = $id;
            $userUpdateData['id'] = $user->id;
            $userUpdateData['first_name'] = $data['contact_person'];
            $userUpdateData['last_name'] = $data['contact_person_last_name'];
            $userUpdateData['role_id'] = $role->id;
            $this->userService->update($userUpdateData);
        } else {
        }

        $company->update($data);

        $flag = 1;
        if (empty($data['invoices']['id']) && $data['agreement_end'] == 0) {
            $flag = 2;
        } elseif (empty($data['invoices']['id']) && $data['agreement_end'] == 1) {
            $flag = 3;
        }

        // print_r($data);
        // exit;

        // Re arrange company tools data
        // Check if request came from Toolbox, then re-arrange tools array
        $company_tools = $data['company_tools'];
        if (!isset($company_tools[0]['tool_id'])) {
            $company_tools = [];
            foreach ($data['company_tools'] as $key => $item) {
                $company_tools[$key]['tool_id'] = Tool::where('slug', $item)->value('id') ;
            }
        }

        if ($flag == 1) {
            //.....before invoice send .....
            $company->tools()->delete();
            $company->addons()->delete();
            $company->materials()->delete();

            $company->tools()->createMany($company_tools);
            $company->addons()->createMany($data['company_addons']);
            $company->materials()->createMany($data['company_materials']);


            $invoice = Invoice::findOrFail($data['invoices']['id']);
            $invoice->update($data['invoices']);

            $invoice->invoiceDetails()->delete();

            $invoice->invoiceDetails()->createMany($data['invoice_details']);
        } elseif ($flag == 2) {
            //.....after invoice send and before end of contract.....
            $company->tools()->createMany($company_tools);
            $company->addons()->createMany($data['company_addons']);
            $company->materials()->createMany($data['company_materials']);
            $invoice = $company->invoices()->create($data['invoices']);
            $invoice->invoiceDetails()->createMany($data['invoice_details']);
        } elseif ($flag == 3) {
            //.....after invoice send and after end of contract.....
            $company->tools()->delete();
            $company->addons()->delete();
            $company->materials()->delete();
            $company->tools()->createMany($company_tools);
            $company->addons()->createMany($data['company_addons']);
            $company->materials()->createMany($data['company_materials']);
            $invoice = $company->invoices()->create($data['invoices']);
            $invoice->invoiceDetails()->createMany($data['invoice_details']);
        }

        return $company;
    }

    public function delete($data)
    {
        $id = $data['id'];
        $company = Company::findOrFail($id);

        $company->tools()->delete();
        $company->addons()->delete();
        $company->materials()->delete();
        $company->users()->delete();

        foreach ($company->invoices as $key => $invoice) {
            $invoice->invoiceDetails()->delete();
        }
        $company->invoices()->delete();

        return Company::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $company = Company::findOrFail($id);
        $company->status = $status;
        $company->save();

        return $company;
    }

    /**
     * @return mixed
     */
    public function countTotalCompanies()
    {
        return Company::count();
    }


    public function numberOfAllowedUsers($companyID)
    {
        return Invoice::where('company_id', $companyID)->get()->sum('number_of_user');
    }

    public function numberOfRegisteredUsers($companyID)
    {
        return User::where('company_id', $companyID)->where('status', 1)->get()->count();
    }

    public function permittedModels($company_id)
    {
        return Company::with('tools')->find($company_id);
    }

    public function companyWithLastInvoice($company_id)
    {
        return Company::with('lastInvoice')->find($company_id);
    }
}
