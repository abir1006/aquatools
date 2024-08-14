<?php

namespace App\Http\Controllers;

use App\Events\CompanyModelUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyStoreRequest;
use App\Http\Requests\CompanyUpdateRequest;
use App\Http\Requests\CustomFieldRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\PaginationRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Models\Company;
use App\Services\CompanyService;
use App\Services\CustomFieldService;
use App\Services\EmailService;
use App\Services\ToolService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class CompanyController extends Controller
{
    protected $companyService;
    private $emailService;
    private $customFieldService;
    private $toolService;

    /**
     * DashboardController constructor.
     * @param CompanyService $companyService
     * @param EmailService $emailService
     * @param CustomFieldService $customFieldService
     * @param ToolService $toolService
     */
    public function __construct(
        CompanyService     $companyService,
        EmailService       $emailService,
        CustomFieldService $customFieldService,
        ToolService        $toolService
    )
    {
        $this->companyService = $companyService;
        $this->emailService = $emailService;
        $this->customFieldService = $customFieldService;
        $this->toolService = $toolService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        $company = $this->companyService->list($request->all());

        return response()->json($company, 200);
    }

    public function listAll(Request $request)
    {
        $company = $this->companyService->listAll($request->all());

        return response()->json($company, 200);
    }

    public function listByToolAccess(Request $request)
    {
        $company = $this->companyService->listByToolAccess($request->all());

        return response()->json($company, 200);
    }

    public function search(Request $request)
    {
        $company = $this->companyService->search($request->all());

        return response()->json($company, 200);
    }


    public function listDetails(Request $request)
    {
        $company = $this->companyService->listDetails($request->all());

        return response()->json($company, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function create(Request $request)
    {
        $company = $this->companyService->save($request->all());
        if (!$company) {
            return response()->json(
                [
                    'message' => 'Error! could not creat company in AquaTools',
                ],
                500
            );
        }
        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $company
            ],
            201
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(CompanyStoreRequest $request)
    {
        $company = $this->companyService->save($request->all());
        if (!$company) {
            return response()->json(
                [
                    'message' => 'Error! could not creat company in AquaTools',
                ],
                500
            );
        }
        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $company
            ],
            201
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function updateFromToolbox(Request $request)
    {
        $request_data = $request->all();

        if ($request->previous_name == '') {
            return response()->json(
                [
                    'message' => "Company name can not be empty",
                    'data' => []
                ],
                500
            );
        }


        $companyObj = $this->companyService->getCompanyByName($request->previous_name);
        if (!$companyObj) {
            return response()->json(
                [
                    'message' => "Company not found named: " . $request->previous_name,
                    'data' => []
                ],
                500
            );
        }
        $request_data['id'] = $companyObj->id;
        $request['id'] = $companyObj->id;

        $today = date('Y-m-d');

        $agreement_end_date = null;
        $agreement_end = 0;

        if (isset($request_data->invoices->agreement_end_date)) {
            $agreement_end_date = $request_data->invoices->agreement_end_date;
        }

        // Check if company agreement expired
        if (strtotime($today) > strtotime($agreement_end_date)) {
            $agreement_end = 1;
        }

        $request_data['agreement_end'] = $agreement_end;
        $request['agreement_end'] = $agreement_end;


        // new logic added to send various emails when company create
        $agreement_extended = false;
        $agreement_new_model_added = false;
        $new_model_email_str = '';

        $current_company = $this->companyService->companyWithLastInvoice($request->id);

        if (isset($request->invoices['agreement_end_date'])) {
            $current_agreement_end_date = strtotime('today');
            if (isset($current_company->lastInvoice[0])) {
                $current_agreement_end_date = $current_company->lastInvoice[0]['agreement_end_date'];
            }
            $updated_agreement_end_date = $request->invoices['agreement_end_date'];
            if (strtotime($updated_agreement_end_date) != strtotime($current_agreement_end_date)) {
                $agreement_extended = true;
                $request_data['status'] = 1;
            }
        }

        // Logic to find new models added in model permission lists.

        if (isset($request->company_tools)) {
            $companyPermittedModels = $this->companyService->permittedModels($request->id)->toArray();
            $model_ids = array_column($companyPermittedModels['tools'], 'tool_id');
            $newPermittedModels = $request->company_tools;
            $new_model_ids = array_column($newPermittedModels, 'tool_id');
            $has_new_models = array_values(array_diff($new_model_ids, $model_ids));
            if (count($has_new_models) > 0) {
                $agreement_new_model_added = true;
                $tools = $this->toolService->find($has_new_models)->toArray();
                foreach ($tools as $key => $tool) {
                    $new_model_email_str .= $tool['name'];
                    if (count($tools) > 1 && ($key + 1) < count($tools)) {
                        $new_model_email_str .= ', ';
                    }
                }
            }
        }

        $company = $this->companyService->update($request_data);


        if (empty($company)) {
            $errors = [
                "email" => ["The email has already been taken."]
            ];

            return response()->json(
                [
                    'message' => 'The given data was invalid.',
                    'data' => $errors
                ],
                200
            );
        }

//         $email_options = array(
//             'agreement_extended' => $agreement_extended,
//             'model_added' => $agreement_new_model_added,
//             'new_model_email_str' => $new_model_email_str,
//         );
//
//         if ($agreement_new_model_added == true && $agreement_extended == true) {
//             Mail::to($current_company->email)->send(
//                 new \App\Mail\AgreementExtended(Company::with('lastInvoice')->find($request->id), $email_options)
//             );
//             $agreement_extended = false;
//             $agreement_new_model_added = false;
//         }
//
//         if ($agreement_extended == true) {
//             Mail::to($current_company->email)->send(
//                 new \App\Mail\AgreementExtended(Company::with('lastInvoice')->find($request->id), $email_options)
//             );
//         }
//
//         if ($agreement_new_model_added == true) {
//             Mail::to($current_company->email)->send(
//                 new \App\Mail\AgreementExtended(Company::find($request->id), $email_options)
//             );
//         }

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $company
            ],
            200
        );
    }


    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(CompanyUpdateRequest $request)
    {
        $request_data = $request->all();
        // new logic added to send various emails when company create
        $agreement_extended = false;
        $agreement_new_model_added = false;
        $new_model_email_str = '';

        $current_company = $this->companyService->companyWithLastInvoice($request->id);

        if (isset($request->invoices['agreement_end_date'])) {
            $current_agreement_end_date = strtotime('today');
            if (isset($current_company->lastInvoice[0])) {
                $current_agreement_end_date = $current_company->lastInvoice[0]['agreement_end_date'];
            }
            $updated_agreement_end_date = $request->invoices['agreement_end_date'];
            if (strtotime($updated_agreement_end_date) != strtotime($current_agreement_end_date)) {
                $agreement_extended = true;
                $request_data['status'] = 1;
            }
        }

        // Logic to find new models added in model permission lists.

        if (isset($request->company_tools)) {
            $companyPermittedModels = $this->companyService->permittedModels($request->id)->toArray();
            $model_ids = array_column($companyPermittedModels['tools'], 'tool_id');
            $newPermittedModels = $request->company_tools;
            $new_model_ids = array_column($newPermittedModels, 'tool_id');
            $has_new_models = array_values(array_diff($new_model_ids, $model_ids));
            if (count($has_new_models) > 0) {
                $agreement_new_model_added = true;
                $tools = $this->toolService->find($has_new_models)->toArray();
                foreach ($tools as $key => $tool) {
                    $new_model_email_str .= $tool['name'];
                    if (count($tools) > 1 && ($key + 1) < count($tools)) {
                        $new_model_email_str .= ', ';
                    }
                }
            }
        }

        $company = $this->companyService->update($request_data);


        if (empty($company)) {
            $errors = [
                "email" => ["The email has already been taken."]
            ];

            return response()->json(
                [
                    'message' => 'The given data was invalid.',
                    'data' => $errors
                ],
                200
            );
        }

        $email_options = array(
            'agreement_extended' => $agreement_extended,
            'model_added' => $agreement_new_model_added,
            'new_model_email_str' => $new_model_email_str,
        );

        if ($agreement_new_model_added == true && $agreement_extended == true) {
            Mail::to($current_company->email)->send(
                new \App\Mail\AgreementExtended(Company::with('lastInvoice')->find($request->id), $email_options)
            );
            $agreement_extended = false;
            $agreement_new_model_added = false;
        }

        if ($agreement_extended == true) {
            Mail::to($current_company->email)->send(
                new \App\Mail\AgreementExtended(Company::with('lastInvoice')->find($request->id), $email_options)
            );
        }

        if ($agreement_new_model_added == true) {
            Mail::to($current_company->email)->send(
                new \App\Mail\AgreementExtended(Company::find($request->id), $email_options)
            );
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $company
            ],
            200
        );
    }

    public function destroyCompanyByName(Request $request, $name)
    {
        $company_data = $this->companyService->getCompanyByName($name);
        $deleted = $this->companyService->delete(['id' => $company_data->id]);
        if ($deleted == 0) {
            return response()->json(
                [
                    'message' => Config::get('settings.message.not_found')
                ],
                404
            );
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(DeleteRequest $request)
    {
        $this->companyService->delete($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    public function changeStatus(StatusUpdateRequest $request)
    {
        $company = $this->companyService->changeStatus($request->all());

        if ($request->status === 0) {
            CompanyModelUpdated::dispatch(Company::find($request->id));
        }

        return response()->json(
            [
                'message' => Config::get('settings.message.updated')
            ],
            200
        );
    }

    public function edit(DeleteRequest $request)
    {
        $company = $this->companyService->edit($request->all());

        return response()->json(
            [
                'data' => $company
            ],
            200
        );
    }

    /**
     * @param CustomFieldRequest $request
     * @return JsonResponse
     */
    public function feedCustomFields(CustomFieldRequest $request)
    {
        $result = $this->customFieldService->feedCustomFields($request->all());
        if (!$result) {
            return response()->json([], 200);
        }
        return response()->json($result->fields, 200);
    }


}
