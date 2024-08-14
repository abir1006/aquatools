<?php

namespace App\Http\Controllers;

use App\Services\CompanyService;
use App\Services\ReportService;
use App\Services\TemplateService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected $userService;
    private $companyService;
    private $templateService;
    private $reportService;

    /**
     * DashboardController constructor.
     * @param UserService $userService
     * @param CompanyService $companyService
     * @param TemplateService $templateService
     * @param ReportService $reportService
     */
    public function __construct(
        UserService $userService,
        CompanyService $companyService,
        TemplateService $templateService,
        ReportService $reportService
    ) {
        $this->userService = $userService;
        $this->companyService = $companyService;
        $this->templateService = $templateService;
        $this->reportService = $reportService;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function view()
    {
        $user = $this->userService->getCurrentUser();
        return response()->json(['user' => $user], 200);
    }

    public function statistics()
    {
        $statistics = array(
            'lastLogin' => [
                'day' => date('d', strtotime($this->userService->lastLoginTime())),
                'month' => date('F', strtotime($this->userService->lastLoginTime())),
                'year' => date('Y', strtotime($this->userService->lastLoginTime())),
            ] ,
            'numberOfCompanies' => $this->companyService->countTotalCompanies(),
            'numberOfAdmins' => $this->userService->countCompanyAdmins(),
            'numberOfUsers' => $this->userService->countTotalUsers(),
            'numberOfTemplates' => $this->templateService->countTotalTemplates(),
            'numberOfReports' => $this->reportService->countTotalReports()
        );
        return response()->json(['data' => $statistics], 200);
    }
}
