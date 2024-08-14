<?php

namespace App\Http\Controllers;

use App\Services\EmailService;
use App\Services\FileService;
use App\Services\ReportService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;


use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\IOFactory;
use PhpOffice\PhpPresentation\Slide\Background\Color;
use PhpOffice\PhpPresentation\Style\Color as StyleColor;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Style\Border;
use PhpOffice\PhpPresentation\Style\Fill;

use PhpOffice\PhpPresentation\Shape\Drawing\Base64;

use PhpOffice\PhpPresentation\Shape\Chart\Type\Bar;
use PhpOffice\PhpPresentation\Shape\Chart\Series;
use PhpOffice\PhpPresentation\Shape\Chart\Type\Line;

class PPTController extends Controller
{

    private $userService;
    private $emailService;
    private $reportService;

    //pptData
    private $pptData = [];

    // Slide header
    private $headerShapeHeight = 75;
    private $infoShapeWidth = 300;
    private $slideOffsetX = 85;
    private $headerShapeOffsetY = 60;

    private $tableHeight = 700;
    private $tableWidth = 785;
    private $tableOffsetY = 160;

    private $rowHeight = 35;
    private $emptyRowHeight = 15;

    private $slideBGColor = 'F6F6F6F6';

    private $fontSize = 12;
    private $headFontSize = 10;
    private $boldFontSize = 12;

    // Slide footer
    private $footerShapeHeight = 50; //30
    private $footerOffsetY = 620;

    private $footerPaginationShapeWidth = 100;
    private $footerPaginationOffsetX = 430;

    private $footerCopyrightShapeWidth = 260;
    private $footerCopyrightOffsetX;


    // slide graph properties

    private $graphShapeWidth = 350;
    private $graphShapeHeight = 200;

    private $g2FirstGraphOffsetX;
    private $g2SecondGraphOffsetX;
    private $g2FirstGraphOffsetY;
    private $g2SecondGraphOffsetY;
    private $g3FirstGraphOffsetX;
    private $g3SecondGraphOffsetX;
    private $g3ThirdGraphOffsetX;
    private $g3FirstGraphOffsetY;
    private $g3SecondGraphOffsetY;
    private $g3ThirdGraphOffsetY;
    private FileService $fileService;


    /**
     * UserController constructor.
     * @param UserService $userService
     * @param EmailService $emailService
     * @param ReportService $reportService
     * @param FileService $fileService
     */
    public function __construct(
        UserService $userService,
        EmailService $emailService,
        ReportService $reportService,
        FileService $fileService
    )
    {
        // ini_set('max_execution_time', 1500);
        $this->userService = $userService;
        $this->emailService = $emailService;
        $this->reportService = $reportService;
        $this->fileService = $fileService;

        $this->footerCopyrightOffsetX = $this->tableWidth - 90;

        $this->g2FirstGraphOffsetX = $this->g3FirstGraphOffsetX = $this->g3ThirdGraphOffsetX = $this->slideOffsetX;
        $this->g2FirstGraphOffsetY = $this->g2SecondGraphOffsetY = $this->tableOffsetY + ($this->graphShapeHeight / 2);
        $this->g3SecondGraphOffsetX = $this->g2SecondGraphOffsetX = $this->slideOffsetX + $this->tableWidth - $this->graphShapeWidth;
        $this->g3FirstGraphOffsetY = $this->tableOffsetY;
        $this->g3SecondGraphOffsetY = $this->tableOffsetY + ($this->graphShapeHeight / 2);
        $this->g3ThirdGraphOffsetY = $this->tableOffsetY + $this->graphShapeHeight + 20;

        app()->setlocale(request('lang'));
    }

    private function header($file_name)
    {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation");
        header("Content-Disposition: attachment; filename=" . $file_name);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function downloadMTBPPT(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $this->pptData = [
            'user' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'reportDate' => date('d/m/Y'),
                'companyLogo' => $currentUserData->company->logo,
            ],
            'caseNumbers' => $request->caseNumbers,
            'modelCaseText' => $request->modelCaseText,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue
        ];

        $objPHPPowerPoint = new PhpPresentation();
        $objPHPPowerPoint->removeSlideByIndex(0);
        $this->slide2($objPHPPowerPoint);
        $this->slide3($objPHPPowerPoint);
        $this->slide4($objPHPPowerPoint);
        $this->slide5($objPHPPowerPoint);
        $this->graphSlide1($objPHPPowerPoint);
        $this->graphSlide2($objPHPPowerPoint);
        $this->graphSlide3($objPHPPowerPoint);
        $this->graphSlide4($objPHPPowerPoint);
        $this->graphSlide5($objPHPPowerPoint);
        $this->graphGrossProfitMargin($objPHPPowerPoint);
        // $this->graphSlide6($objPHPPowerPoint);

        $fileName = 'MTB_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pptx';

        $this->header($fileName);

        $oWriterPPTX = IOFactory::createWriter($objPHPPowerPoint, 'PowerPoint2007');

        $pptSavedPath = "/tmp";

        if (!file_exists($pptSavedPath)) {
            mkdir($pptSavedPath, 0777, true);
        }

        $oWriterPPTX->save($pptSavedPath . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('ppt/models', $pptSavedPath . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'ppt';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);

        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pptSavedPath . '/' . $fileName];
            $emailTemplate = 'email.mtb.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from MTB Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'Power Point',
                    'email_to' => 'others'
                );
                try {
                    $this->emailService->at2SendEmail(
                        '',
                        $request->pdfEmail,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files,
                        $currentUserData->email
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - A report from MTB Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'Power Point',
                    'email_to' => 'me'
                );
                try {
                    $this->emailService->at2SendEmail(
                        'Xyz',
                        $currentUserData->email,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }

        $oWriterPPTX->save('php://output');
    }

    private function slide1(&$objPHPPowerPoint)
    {
    }

    //feed model

    public function downloadFeedPPT(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $this->pptData = [
            'user' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'reportDate' => date('d/m/Y'),
                'companyLogo' => $currentUserData->company->logo,
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            "vektutviklingValue" => $request->vektutvikling
        ];

        $objPHPPowerPoint = new PhpPresentation();
        $objPHPPowerPoint->removeSlideByIndex(0);
        $this->feedSlide2($objPHPPowerPoint);
        $this->feedSlide3($objPHPPowerPoint);
        $this->feedSlide4($objPHPPowerPoint);
        $this->feedGraphSlide1($objPHPPowerPoint);
        $this->feedGraphSlide2($objPHPPowerPoint);
        $this->feedGraphSlide3($objPHPPowerPoint);
        $this->feedGraphSlide4($objPHPPowerPoint);


        $fileName = 'FEED_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pptx';

        $this->header($fileName);

        $oWriterPPTX = IOFactory::createWriter($objPHPPowerPoint, 'PowerPoint2007');

        $pptSavedPath = "/tmp";

        if (!file_exists($pptSavedPath)) {
            mkdir($pptSavedPath, 0777, true);
        }

        $oWriterPPTX->save($pptSavedPath . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('ppt/models', $pptSavedPath . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'ppt';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);

        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pptSavedPath . '/' . $fileName];
            $emailTemplate = 'email.feed.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Feed C/B Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'Power Point',
                    'email_to' => 'others'
                );
                try {
                    $this->emailService->at2SendEmail(
                        '',
                        $request->pdfEmail,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files,
                        $currentUserData->email
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - A report from Feed C/B Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'Power Point',
                    'email_to' => 'me'
                );
                try {
                    $this->emailService->at2SendEmail(
                        'Xyz',
                        $currentUserData->email,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }

        $oWriterPPTX->save('php://output');
    }

    //vaccine model
    public function downloadVaccinePPT(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $this->pptData = [
            'user' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'reportDate' => date('d/m/Y'),
                'companyLogo' => $currentUserData->company->logo,
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            'inputs' => $request->inputs
        ];

        $objPHPPowerPoint = new PhpPresentation();
        $objPHPPowerPoint->removeSlideByIndex(0);
        $this->vaccineSlide2($objPHPPowerPoint);
        $this->vaccineSlide3($objPHPPowerPoint);
        $this->vaccineSlide4($objPHPPowerPoint);
        $this->vaccineSlide5($objPHPPowerPoint);
        $this->vaccineGraph1($objPHPPowerPoint);
        $this->vaccineGraph2($objPHPPowerPoint);
        $this->vaccineGraphGrossProfitMargin($objPHPPowerPoint);
        // $this->vaccineGraph3($objPHPPowerPoint);


        $fileName = 'Vaccine_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pptx';

        $this->header($fileName);

        $oWriterPPTX = IOFactory::createWriter($objPHPPowerPoint, 'PowerPoint2007');

        $pptSavedPath = "/tmp";

        if (!file_exists($pptSavedPath)) {
            mkdir($pptSavedPath, 0777, true);
        }

        $oWriterPPTX->save($pptSavedPath . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('ppt/models', $pptSavedPath . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'ppt';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);

        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pptSavedPath . '/' . $fileName];
            $emailTemplate = 'email.vaccine.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Vaccine Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'Power Point',
                    'email_to' => 'others'
                );
                try {
                    $this->emailService->at2SendEmail(
                        '',
                        $request->pdfEmail,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files,
                        $currentUserData->email
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - A report from Vaccine Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'Power Point',
                    'email_to' => 'me'
                );
                try {
                    $this->emailService->at2SendEmail(
                        'Xyz',
                        $currentUserData->email,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }

        $oWriterPPTX->save('php://output');
    }

    //cod model
    public function downloadCodPPT(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $this->pptData = [
            'user' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'reportDate' => date('d/m/Y'),
                'companyLogo' => $currentUserData->company->logo,
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            'inputs' => $request->inputs
        ];

        $objPHPPowerPoint = new PhpPresentation();
        $objPHPPowerPoint->removeSlideByIndex(0);
        $this->codSlide2($objPHPPowerPoint);
        $this->codSlide3($objPHPPowerPoint);
        $this->codSlide4($objPHPPowerPoint);
        $this->codSlide5($objPHPPowerPoint);
        $this->codGraph1($objPHPPowerPoint);
        $this->codGraph2($objPHPPowerPoint);
        $this->codGraph3($objPHPPowerPoint);
        $this->codGraphGPM($objPHPPowerPoint);


        $fileName = 'Cod_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pptx';

        $this->header($fileName);

        $oWriterPPTX = IOFactory::createWriter($objPHPPowerPoint, 'PowerPoint2007');

        $pptSavedPath = "/tmp";

        if (!file_exists($pptSavedPath)) {
            mkdir($pptSavedPath, 0777, true);
        }

        $oWriterPPTX->save($pptSavedPath . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('ppt/models', $pptSavedPath . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'ppt';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);

        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pptSavedPath . '/' . $fileName];
            $emailTemplate = 'email.cod.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Cost of Disease Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'Power Point',
                    'email_to' => 'others'
                );
                try {
                    $this->emailService->at2SendEmail(
                        '',
                        $request->pdfEmail,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files,
                        $currentUserData->email
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - A report from Cost of Disease Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'Power Point',
                    'email_to' => 'me'
                );
                try {
                    $this->emailService->at2SendEmail(
                        'Xyz',
                        $currentUserData->email,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }

        $oWriterPPTX->save('php://output');
    }


    public function downloadOptimizationPPT(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $this->pptData = [
            'user' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'reportDate' => date('d/m/Y'),
                'companyLogo' => $currentUserData->company->logo,
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            'inputs' => $request->inputs
        ];

        $objPHPPowerPoint = new PhpPresentation();
        $objPHPPowerPoint->removeSlideByIndex(0);
        $this->optimizationSlide2($objPHPPowerPoint);
        $this->optimizationSlide3($objPHPPowerPoint);
        $this->optimizationSlide4($objPHPPowerPoint);
        $this->optimizationGraph1($objPHPPowerPoint);
        $this->optimizationGraph2($objPHPPowerPoint);
        // $this->optimizationGraph3($objPHPPowerPoint);
        $this->optGraphGrossProfitMargin($objPHPPowerPoint);


        $fileName = 'Optimization_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pptx';

        $this->header($fileName);

        $oWriterPPTX = IOFactory::createWriter($objPHPPowerPoint, 'PowerPoint2007');

        $pptSavedPath = "/tmp";

        if (!file_exists($pptSavedPath)) {
            mkdir($pptSavedPath, 0777, true);
        }

        $oWriterPPTX->save($pptSavedPath . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('ppt/models', $pptSavedPath . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'ppt';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);

        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pptSavedPath . '/' . $fileName];
            $emailTemplate = 'email.optimization.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Optimization Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'Power Point',
                    'email_to' => 'others'
                );
                try {
                    $this->emailService->at2SendEmail(
                        '',
                        $request->pdfEmail,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files,
                        $currentUserData->email
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - A report from Optimization Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'Power Point',
                    'email_to' => 'me'
                );
                try {
                    $this->emailService->at2SendEmail(
                        'Xyz',
                        $currentUserData->email,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }

        $oWriterPPTX->save('php://output');
    }


    public function downloadGeneticsPPT(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $this->pptData = [
            'user' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'reportDate' => date('d/m/Y'),
                'companyLogo' => $currentUserData->company->logo,
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            'inputs' => $request->inputs
        ];

        $objPHPPowerPoint = new PhpPresentation();
        $objPHPPowerPoint->removeSlideByIndex(0);
        $this->geneticsSlide2($objPHPPowerPoint);
        $this->geneticsSlide3($objPHPPowerPoint);
        $this->geneticsSlide4($objPHPPowerPoint);
        $this->geneticsGraph1($objPHPPowerPoint);
        $this->geneticsGraph2($objPHPPowerPoint);
        $this->geneticGraphGrossProfitMargin($objPHPPowerPoint);
        // $this->geneticsGraph3($objPHPPowerPoint);


        $fileName = 'Genetics_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pptx';

        $this->header($fileName);

        $oWriterPPTX = IOFactory::createWriter($objPHPPowerPoint, 'PowerPoint2007');

        $pptSavedPath = "/tmp";

        if (!file_exists($pptSavedPath)) {
            mkdir($pptSavedPath, 0777, true);
        }

        $oWriterPPTX->save($pptSavedPath . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('ppt/models', $pptSavedPath . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'ppt';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);

        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pptSavedPath . '/' . $fileName];
            $emailTemplate = 'email.genetics.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Genetics Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'Power Point',
                    'email_to' => 'others'
                );
                try {
                    $this->emailService->at2SendEmail(
                        '',
                        $request->pdfEmail,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files,
                        $currentUserData->email
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - A report from Genetics Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'Power Point',
                    'email_to' => 'me'
                );
                try {
                    $this->emailService->at2SendEmail(
                        'Xyz',
                        $currentUserData->email,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files
                    );
                    $response = ['email' => 'Email sent'];
                    print_r(json_encode($response));
                    exit;
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }

        $oWriterPPTX->save('php://output');
    }

    private function geneticsModelHeader(&$currentSlide)
    {
        $inputs = $this->pptData['inputs'];
        $headerData =
            [
                'site' => $inputs['genetics_general_lokalitet_case1'],
                'generation' => $inputs['genetics_general_generasjon_case1'],
                'name' => $inputs['genetics_general_navn_case1'],
            ];

        $this->slideHeader($currentSlide, $headerData);
    }


    private function optimizationModelHeader(&$currentSlide)
    {
        $inputs = $this->pptData['inputs'];
        $headerData =
            [
                'site' => $inputs['optimalisering_general_lokalitet_case1'],
                'generation' => $inputs['optimalisering_general_generasjon_case1'],
                'name' => $inputs['optimalisering_general_navn_case1'],
            ];

        $this->slideHeader($currentSlide, $headerData);
    }

    private function optimizationModelFooter(&$currentSlide, $slideNumber)
    {
        $totalSlides = 6;
        $this->slideFooter($currentSlide, $slideNumber, $totalSlides);
    }


    private function codModelHeader(&$currentSlide)
    {
        $inputs = $this->pptData['inputs'];
        $headerData =
            [
                'site' => $inputs['cost_of_disease_general_lokalitet_case1'],
                'generation' => $inputs['cost_of_disease_general_generasjon_case1'],
                'name' => $inputs['cost_of_disease_general_navn_case1'],
            ];

        $this->slideHeader($currentSlide, $headerData);
    }

    private function vaccineModelHeader(&$currentSlide)
    {
        $inputs = $this->pptData['inputs'];
        $headerData =
            [
                'site' => $inputs['vaksinering_general_lokalitet_case1'],
                'generation' => $inputs['vaksinering_general_generasjon_case1'],
                'name' => $inputs['vaksinering_general_navn_case1'],
            ];

        $this->slideHeader($currentSlide, $headerData);
    }

    private function slideHeader(&$currentSlide, $data)
    {
        // Slider header start
        $infoShape = $currentSlide->createRichTextShape()
            ->setHeight($this->headerShapeHeight)
            ->setWidth($this->infoShapeWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->headerShapeOffsetY - 20);

        $infoShape->createTextRun($this->pptData['user']['company'])->getFont()->setSize(14)->setBold(true);
        $infoShape->createBreak();
        $infoShape->createTextRun(__('site') . ": " . $data['site'])->getFont()->setSize($this->fontSize);
        $infoShape->createBreak();
        $infoShape->createTextRun(__('generation') . ": " . $data['generation'])->getFont()->setSize($this->fontSize);
        $infoShape->createBreak();
        $infoShape->createTextRun(__('name') . ": " . $data['name'])->getFont()->setSize($this->fontSize);
        $infoShape->createBreak();
        $infoShape->createTextRun(
            __('date') . ": " . str_replace('/', '.', $this->pptData['user']['reportDate'])
        )->getFont()->setSize($this->fontSize);
        // if ($this->pptData['user']['companyLogo'] != '') {
            // $infoShape->createBreak();   
            // $infoShape->createTextRun(__('logoUrl') . ": " . Storage::url("uploads/company_logo/" . $this->pptData['user']['companyLogo']))->getFont()->setSize(8);
        // }
        if ($this->pptData['user']['companyLogo'] != '') {
            $str = Storage::url("uploads/company_logo/" . $this->pptData['user']['companyLogo']); // "images/1613121872.png"; 
            $companyLogoUrl = ltrim($str, '/');
            // storage_path('app/public/uploads/company_logo/'.$this->pptData['user']['companyLogo']);  
            $size = @getimagesize($companyLogoUrl);
            if ($size) {
                $logoWidth = $size[0];
                $logoHeight = $size[1];

                $ratio = $logoWidth / $logoHeight;
                $logoShapeWidth = $ratio * $this->headerShapeHeight;
                $logoShapeOffsetX = ($this->slideOffsetX + $this->tableWidth) - $logoShapeWidth;
                $logoShape = new Base64();
                $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($companyLogoUrl));
                $height = $this->headerShapeHeight - ($this->headerShapeHeight * .25);
                $width = $logoShapeWidth - ($logoShapeWidth * .25);
                $logoShape->setName('')
                    ->setDescription('')
                    ->setData($imageData)
                    ->setResizeProportional(false)
                    ->setHeight($height)
                    ->setWidth($width)
                    ->setOffsetX($logoShapeOffsetX)
                    ->setOffsetY($this->headerShapeOffsetY);
                $currentSlide->addShape($logoShape);
            }
        }
    }

    private function slideFooter(&$currentSlide, $slideNumber, $totalSlides = 6)
    {
        // Slide footer start

        // URL::to('/') .

        $spillFreeLogo = "images/at2_logo1.png";
        $sfLogoSize = getimagesize($spillFreeLogo);
        $sfLogoWidth = $sfLogoSize[0];
        $sfLogoHeight = $sfLogoSize[1];
        $footerLogoRatio = $sfLogoWidth / $sfLogoHeight;
        $footerLogoShapeWidth = $footerLogoRatio * $this->footerShapeHeight;

        $logoShape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($spillFreeLogo));

        $logoShape->setName('')
            ->setDescription('')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight(50) // $this->footerShapeHeight
            ->setWidth($footerLogoShapeWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->footerOffsetY + 20 + $slideNumber);
        $currentSlide->addShape($logoShape);


        $footerPaginationShape = $currentSlide->createRichTextShape()
            ->setHeight($this->footerShapeHeight)
            ->setWidth($this->footerPaginationShapeWidth)
            ->setOffsetX($this->footerPaginationOffsetX)
            ->setOffsetY($this->footerOffsetY + 20);

        $footerPaginationShape->createTextRun(__('slide') . " $slideNumber/$totalSlides")->getFont()->setSize(8);

        $footerCopyrightShape = $currentSlide->createRichTextShape()
            ->setHeight($this->footerShapeHeight)
            ->setWidth($this->footerCopyrightShapeWidth)
            ->setOffsetX($this->footerCopyrightOffsetX)
            ->setOffsetY($this->footerOffsetY + 20);

        $footerCopyrightShape->createTextRun(date('Y') . " © SpillFree Analytics AS")->getFont()->setSize(8);
    }


    private function MTBModelFooter(&$currentSlide, $slideNumber)
    {
        $totalSlides = 10;
        $this->slideFooter($currentSlide, $slideNumber, $totalSlides);
    }

    private function MTBModelHeader(&$currentSlide)
    {
        // Slider header start
        $infoShape = $currentSlide->createRichTextShape()
            ->setHeight($this->headerShapeHeight)
            ->setWidth($this->infoShapeWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->headerShapeOffsetY - 10);

        $infoShape->createTextRun($this->pptData['user']['company'])->getFont()->setSize(14)->setBold(true);
        $infoShape->createBreak();
        $infoShape->createTextRun(__('customer') . ": " . $this->pptData['user']['name'])->getFont()->setSize(
            $this->fontSize
        );
        $infoShape->createBreak();
        $infoShape->createTextRun(__('date') . ": " . $this->pptData['user']['reportDate'])->getFont()->setSize(
            $this->fontSize
        );

        if ($this->pptData['user']['companyLogo'] != '') {
            $str = Storage::url("uploads/company_logo/" . $this->pptData['user']['companyLogo']); // "images/1613121872.png";
            $companyLogoUrl = ltrim($str, '/');
            // storage_path('app/public/uploads/company_logo/'.$this->pptData['user']['companyLogo']);
            $size = @getimagesize($companyLogoUrl);
            if ($size) {
                $logoWidth = $size[0];
                $logoHeight = $size[1];
                $ratio = $logoWidth / $logoHeight;
                $logoShapeWidth = $ratio * $this->headerShapeHeight;
                $logoShapeOffsetX = ($this->slideOffsetX + $this->tableWidth) - $logoShapeWidth;
                $logoShape = new Base64();
                $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($companyLogoUrl));
                $logoShape->setName('')
                    ->setDescription('')
                    ->setData($imageData)
                    ->setResizeProportional(false)
                    ->setHeight($this->headerShapeHeight)
                    ->setWidth($logoShapeWidth)
                    ->setOffsetX($logoShapeOffsetX)
                    ->setOffsetY($this->headerShapeOffsetY);
                $currentSlide->addShape($logoShape);
            }
        }
    }

    private function formatCell($cell, $fillType = null)
    {
        if (is_null($fillType)) {
            $fillType = Fill::FILL_SOLID;
        }

        $cell->getFill()->setFillType($fillType);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

        return $cell;
    }

    private function getMTBData($key)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $data = [];

        foreach ($caseNumbers as $case) {
            //$caseText = isset( $modelCaseText['case'.$case] ) ?  $modelCaseText['case'.$case] : __('case') . ' ' . $case;
            $label = isset($this->pptData['modelCaseText']['case' . $case]) ? $this->pptData['modelCaseText']['case' . $case] : __('case') . ' ' . $case;
            $graph_value = (float)$graphResult[$key]['Case' . $case];

            if (strlen(explode('.', $graph_value)[0]) >= 4) {
                $graph_value = (int)round($graphResult[$key]['Case' . $case]);
            }

            if (strlen(explode('.', $graph_value)[0]) == 3 && strlen(explode('.', $graph_value)[1]) >= 1) {
                $graph_value = round($graphResult[$key]['Case' . $case], 1);
            }

            logger($key . ': ' . $graph_value);

            $data[$label] = $graph_value;
        }

        return $data;
    }

    private function getFeedData($key)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $data = [];

        foreach ($caseNumbers as $case) {
            $label = isset($this->pptData['modelCaseText']['case' . $case]) ? $this->pptData['modelCaseText']['case' . $case] : __('case') . ' ' . $case;
            $data[$label] = (float)$graphResult[$key]['Case' . $case];
        }

        return $data;
    }

    private function getOptimizationData($key)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $inputs = $this->pptData['inputs'];

        $data = [];

        foreach ($caseNumbers as $case) {
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $data[$label] = (float)$graphResult[$key]['Case' . $case];
        }

        return $data;
    }

    private function getVaccineData($key)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $inputs = $this->pptData['inputs'];

        $data = [];
        $vaks = ['vacc_a', 'vacc_b', 'vacc_c'];

        foreach ($caseNumbers as $case) {
            $label = '';
            if ($case == 1) {
                $label = isset($inputs['budget_name']) ? $inputs['budget_name'] : __('budget');
            } elseif ($case == 2) {
                $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
            } else {
                $label = __($vaks[$case - 3]);
            }

            $data[$label] = (float)$graphResult[$key]['Case' . $case];
        }


        return $data;
    }

    private function getMinValue($data, $baseValue)
    {
        $chart_values = $data;
        $chart_max = max($chart_values);
        $chart_step = $chart_max < $baseValue ? $chart_max / 3 : ($chart_max - $baseValue) / 3;
        $chart_min = min($chart_values) <= $baseValue ? min($chart_values) - $chart_step : $baseValue;
        return $chart_min;
    }

    private function generateGroupBarChart(
        $currentSlide,
        $data,
        $title,
        $graphOffsetX = 0,
        $graphOffsetY = 0,
        $min = 0,
        $max = 0,
        $graphFontSize = 0,
        $showPercentange = false,
        $type = 'clustered',
        $decimal = 1
    )
    {
        if (!$graphFontSize) {
            $graphFontSize = round(12 / count($this->pptData['caseNumbers'])) + 6;
        }

        $graphFontSize = 8;
        $titleFontSize = 10;
        $axisLabelFontSize = 2;

        $barChart = new Bar();
        $barChart->setGapWidthPercent(100);

        foreach ($data as $item) {
            $series = new Series('', $item);
            $series->setShowSeriesName(false);
            $series->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new StyleColor('FF1573c3'));
            $series->getFont()->setSize($graphFontSize)->setBold(true)->getColor()->setRGB('000000');
            $series->setLabelPosition(Series::LABEL_OUTSIDEEND);

            $numberFormat = $this->setBarValueFormat($showPercentange, $decimal);

            $series->setDlblNumFormat($numberFormat);

            $barChart->addSeries($series);
        }


        $barChart->setBarGrouping(Bar::GROUPING_CLUSTERED);

        $shape = $currentSlide->createChartShape();
        $shape->setName('')
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($graphOffsetX)
            ->setOffsetY($graphOffsetY);


        $shape->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new StyleColor('FFFFFFFF'));
        $shape->getBorder()->setLineWidth(0)->setLineStyle(Border::LINE_NONE);
        $shape->getTitle()->setText($title)->getFont()->setSize($titleFontSize)->setBold(true);
        $shape->getTitle()->getFont()->setItalic(false);
        $shape->getTitle()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $shape->getPlotArea()->getAxisX()->setTitle('');
        $shape->getPlotArea()->getAxisY()->setTitle('');

        $shape->getPlotArea()->getAxisX()->getOutline()->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(
            new StyleColor('FFAFAFAF')
        );
        $shape->getPlotArea()->getAxisY()->getOutline()->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(
            new StyleColor('FFAFAFAF')
        );

        if ($min) {
            $shape->getPlotArea()->getAxisY()->setMinBounds($min);
        }

        if ($max) {
            $shape->getPlotArea()->getAxisY()->setMaxBounds($max);
        }


        $shape->getPlotArea()->setType($barChart);
        $shape->getLegend()->setVisible(false);
    }

    private function setMTBBarValueFormat($showPercentange)
    {
        $numberFormat = '### ### ##0';
        if ($showPercentange) {
            $numberFormat .= ' %';
        }


        return $numberFormat;
    }

    private function setBarValueFormat($showPercentange, $decimal)
    {
        $numberFormat = '### ### ##0';
        if ($decimal) {
            $numberFormat .= '.';

            for ($i = 0; $i < $decimal; $i++) {
                $numberFormat .= '0';
            }
        }

        if ($showPercentange) {
            $numberFormat .= ' %';
        }


        return $numberFormat;
    }

    private function generateMTBBarChart(
        $currentSlide,
        $data,
        $title,
        $graphOffsetX = 0,
        $graphOffsetY = 0,
        $min = 0,
        $max = 0,
        $graphFontSize = 0,
        $showPercentange = false
    )
    {
        if (!$graphFontSize) {
            $graphFontSize = round(12 / count($this->pptData['caseNumbers'])) + 6;
        }

        $graphFontSize = 8;
        $titleFontSize = 10;
        $axisLabelFontSize = 2;

        //if showPercentange=true, divide data by 100;

        if ($showPercentange) {
            $data = array_map(
                function ($x) {
                    return $x / 100;
                },
                $data
            );
        }


        $barChart = new Bar();
        $barChart->setGapWidthPercent(100);
        $series = new Series('', $data);
        $series->setShowSeriesName(false);
        $series->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new StyleColor('FF1573c3'));
        $series->getFont()->setSize($graphFontSize)->setBold(true)->getColor()->setRGB('000000');
        $series->setLabelPosition(Series::LABEL_OUTSIDEEND);

        //$numberFormat = $this->setMTBBarValueFormat($showPercentange);

        //$series->setDlblNumFormat($numberFormat);

        $barChart->addSeries($series);

        $shape = $currentSlide->createChartShape();
        $shape->setName('')
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($graphOffsetX)
            ->setOffsetY($graphOffsetY);


        $shape->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new StyleColor('FFFFFFFF'));
        $shape->getBorder()->setLineWidth(0)->setLineStyle(Border::LINE_NONE);
        $shape->getTitle()->setText($title)->getFont()->setSize($titleFontSize)->setBold(true);
        $shape->getTitle()->getFont()->setItalic(false);
        $shape->getTitle()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $shape->getPlotArea()->getAxisX()->setTitle('');
        $shape->getPlotArea()->getAxisY()->setTitle('');

        $shape->getPlotArea()->getAxisX()->getOutline()->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(
            new StyleColor('FFAFAFAF')
        );
        $shape->getPlotArea()->getAxisY()->getOutline()->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(
            new StyleColor('FFAFAFAF')
        );

        if ($min) {
            $shape->getPlotArea()->getAxisY()->setMinBounds($min);
        }

        if ($max) {
            $shape->getPlotArea()->getAxisY()->setMaxBounds($max);
        }


        $shape->getPlotArea()->setType($barChart);
        $shape->getLegend()->setVisible(false);
    }

    private function generateBarChart(
        $currentSlide,
        $data,
        $title,
        $graphOffsetX = 0,
        $graphOffsetY = 0,
        $min = 0,
        $max = 0,
        $graphFontSize = 0,
        $showPercentange = false,
        $decimal = 2
    )
    {
        if (!$graphFontSize) {
            $graphFontSize = round(12 / count($this->pptData['caseNumbers'])) + 6;
        }

        $graphFontSize = 8;
        $titleFontSize = 10;
        $axisLabelFontSize = 2;

        //if showPercentange=true, divide data by 100;

        if ($showPercentange) {
            $data = array_map(
                function ($x) {
                    return $x / 100;
                },
                $data
            );
        }


        $barChart = new Bar();
        $barChart->setGapWidthPercent(100);
        $series = new Series('', $data);
        $series->setShowSeriesName(false);
        $series->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new StyleColor('FF1573c3'));
        $series->getFont()->setSize($graphFontSize)->setBold(true)->getColor()->setRGB('000000');
        $series->setLabelPosition(Series::LABEL_OUTSIDEEND);

        $numberFormat = $this->setBarValueFormat($showPercentange, $decimal);

        $series->setDlblNumFormat($numberFormat);

        $barChart->addSeries($series);

        $shape = $currentSlide->createChartShape();
        $shape->setName('')
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($graphOffsetX)
            ->setOffsetY($graphOffsetY);


        $shape->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new StyleColor('FFFFFFFF'));
        $shape->getBorder()->setLineWidth(0)->setLineStyle(Border::LINE_NONE);
        $shape->getTitle()->setText($title)->getFont()->setSize($titleFontSize)->setBold(true);
        $shape->getTitle()->getFont()->setItalic(false);
        $shape->getTitle()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $shape->getPlotArea()->getAxisX()->setTitle('');
        $shape->getPlotArea()->getAxisY()->setTitle('');

        $shape->getPlotArea()->getAxisX()->getOutline()->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(
            new StyleColor('FFAFAFAF')
        );
        $shape->getPlotArea()->getAxisY()->getOutline()->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(
            new StyleColor('FFAFAFAF')
        );

        if ($min) {
            $shape->getPlotArea()->getAxisY()->setMinBounds($min);
        }

        if ($max) {
            $shape->getPlotArea()->getAxisY()->setMaxBounds($max);
        }


        $shape->getPlotArea()->setType($barChart);
        $shape->getLegend()->setVisible(false);
    }

    private function geneticsSlide2(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->geneticsModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('basic_preconditions_in_the_model')))->getFont()->setSize(
            $this->headFontSize
        )->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell);
            $cell->createTextRun('')->getFont()->setSize($this->headFontSize);
        }


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('number_of_smolts'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);

            $text = $case == 1 ? number_format(
                $inputs['genetics_produksjonsmodell_antall_smolt_case1'],
                0,
                '.',
                ' '
            ) : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('harvest_weight_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? $tableViewResult['case1']['slaktevektHOGkg'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('salmon_price_nok_per_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? $inputs['genetics_produksjonsmodell_laksepris_case1'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();

        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');

        $cell->createTextRun(__('number_of_eggs_per_smolt'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? $inputs['genetics_grunnforutsetninger_antall_rogn_per_smolt_case1'] : '';

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 6
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('estimated_total_cost_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? $tableViewResult['case1']['totalProdKostCase1'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 7
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('variable_costs_in_percentage_of_total_production_cost'))->getFont()->setSize(
            $this->fontSize
        );

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? $tableViewResult['case1']['totalVariableKost'] . '%' : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('effects_improved_production')))->getFont()->setSize(
            $this->headFontSize
        )->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $cell->createTextRun("$label")->getFont()->setSize($this->headFontSize)->setBold(true);
        }


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('increased_growth_grams'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['oktSlaktevektGram'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('reduced_mortality_in_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['redusertDodelighetPercentage'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('average_weight_of_reduced_mortality_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['snittvektDeadfiskKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('reduced_bfcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['redusertBFCRPercentage'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function geneticsSlide3(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->geneticsModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start


        //new table
        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('effects_improved_production')))->getFont()->setSize(
            $this->headFontSize
        )->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $cell->createTextRun("$label")->getFont()->setSize($this->headFontSize)->setBold(true);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('reduced_prod_cost_per_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $inputs['genetics_effekter_genetikk_reduksjon_prodkost_per_kg_case' . $case];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('reduced_in_downgrading_prod_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['reduksjonNedklassingProdPercentage'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('result_improve_production')))->getFont()->setSize(
            $this->headFontSize
        )->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $cell->createTextRun("$label")->getFont()->setSize($this->headFontSize)->setBold(true);
        }


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('slaughter_volume_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['slaktevolumHGkg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('average_salmon_price_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['lakseprisNOKPerKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('sales_value_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['salgsverdiNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('prod_cost_nok_per_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['prodkostKrPerkg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('operating_profit_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['driftsResultatNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['dodelighetPercentage'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('efcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['efcr'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('extra_genetics_cost_per_egg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['merkostnadTiltakProduksjonNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function geneticsSlide4(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->geneticsModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        //new table
        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('result_improve_production')))->getFont()->setSize(
            $this->headFontSize
        )->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $cell->createTextRun("$label")->getFont()->setSize($this->headFontSize)->setBold(true);
        }


        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('extra_cost_increased_egg_price_total'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['merkostnadTiltakProduksjonNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('more_slaughtered_genetics_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['merslaktKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('increased_profit_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['oktResultatNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('gross_profit_margin'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['grossProfitMargin'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

//        $row = $table->createRow();
//        $row->setHeight($this->rowHeight);
//        $cell->setWidth($tableLabelCellTotalWidth);
//        $cell = $row->nextCell();
//        $cell = $this->formatCell($cell, Fill::FILL_NONE);
//        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
//        $cell->createTextRun(__('benefit_cost_ratio'))->getFont()->setSize($this->fontSize);
//
//        foreach ($this->pptData['caseNumbers'] as $case) {
//            $cell = $row->nextCell();
//            $cell->setWidth($cellWidth);
//            $cell = $this->formatCell($cell, Fill::FILL_NONE);
//            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
//            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['nytteKostRatio2'];
//            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
//        }


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function geneticsGraph1(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->geneticsModelHeader($currentSlide);


        // graph 1

        $key = 'slaktevektRundKg';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_weight_at_slaughter_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY + 20,
            $min,
            0,
            0
        );


        // graph 2

        $key = 'slaktevolumHOGTonn';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('slaughter_volume_hog_tonn'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false,
            1
        );


        // graph 3

        $key = 'efcr';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('economic_feed_conversion_ratio_efcr'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY + 20,
            $min,
            0
        );


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function geneticsGraph2(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->geneticsModelHeader($currentSlide);


        // graph 1

        $key = 'prodkostPerKg';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('prod_cost_nok_per_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY + 20,
            $min,
            0,
            0
        );


        // graph 2

        $key = 'driftsResultatNOK1000';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('operating_profit_nok_1000'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false,
            0
        );


        // graph 3

        $key = 'LakseprisNOKPerKg';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_salmon_price_nok_kg'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY + 20,
            $min,
            0
        );


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function geneticsGraph3(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->geneticsModelHeader($currentSlide);


        //Nikto Radio
        $nkr1 = $graphResult['nytteKostRatio1'];
        $nkr2 = $graphResult['nytteKostRatio2'];

        unset($nkr1['Case1']);
        unset($nkr2['Case1']);


        $nkData = [
            'nytteKostRatio2' => $nkr2
        ];

        $nkLabels = [];
        foreach ($nkr1 as $case => $value) {
            $nkLabels[] = "'" . __(strtolower($case)) . "'";
        }

        $nkLabelsStr = implode(',', $nkLabels);
        $title = __('benefit_cost_ratio');
        $chart7 = PDFController::drawNikktoGraph($nkLabelsStr, $nkData, null, true, $title);
        $chart7 = urlencode($chart7);

        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $chart7;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('nikkto')
            ->setDescription('nikkto graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($this->g2FirstGraphOffsetX)
            ->setOffsetY($this->g2FirstGraphOffsetY);
        $currentSlide->addShape($shape);


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function optimizationSlide2(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->optimizationModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth + 10);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('basic_preconditions_in_the_model'))->getFont()->setSize($this->headFontSize)->setBold(
            true
        );

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell);
            $cell->createTextRun('')->getFont()->setSize($this->headFontSize);
        }


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('number_of_smolts'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? number_format(
                $inputs['optimalisering_produksjonsmodell_antall_smolt_case1'],
                0,
                '.',
                ' '
            ) : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('salmon_price_nok_per_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? $inputs['optimalisering_produksjonsmodell_laksepris_case1'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('prod_cost_nok_per_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? $inputs['optimalisering_produksjonsmodell_prod_kost_case1'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('smolt_weight_in_grams'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? preg_replace(
                "/\.00$/",
                '',
                number_format(
                    $inputs['optimalisering_grunnforutsetninger_smoltvekt_gram_case1'],
                    2,
                    '.',
                    ' '
                )
            ) : '';

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('day_degrees'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? preg_replace(
                "/\.00$/",
                '',
                number_format(
                    $inputs['optimalisering_grunnforutsetninger_dgngrader_utsett_slakt_case1'],
                    2,
                    '.',
                    ' '
                )
            ) : '';

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('vf3'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? $inputs['optimalisering_grunnforutsetninger_vf3_historisk_case1'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 4


        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('harvest_weight_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? $tableViewResult['case1']['slaktevektHOGkg'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 5
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? $inputs['optimalisering_grunnforutsetninger_ddelighet_case1'] . '%' : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 6
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('estimated_total_cost_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? $tableViewResult['case1']['totalProdKostCase1'] : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 7
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('variable_costs_in_percentage_of_total_production_cost'))->getFont()->setSize(
            $this->fontSize
        );

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? $tableViewResult['case1']['totalVariableKost'] . '%' : '';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function optimizationSlide3(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->optimizationModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('effects_improved_production')))->getFont()->setSize(
            $this->headFontSize
        )->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $cell->createTextRun("$label")->getFont()->setSize($this->headFontSize)->setBold(true);
        }


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('increased_harvest_weight_gram'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['oktSlaktevektGram'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('reduced_mortality_in_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['redusertDodelighetPercentage'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('average_weight_mortality'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['snittvektDeadfiskKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('reduced_bfcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['redusertBFCRPercentage'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('reduced_in_downgrading_prod_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['reduksjonNedklassingProdPercentage'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('reduced_discard_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['reduksjonUtkastPercentage'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        //new table
        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->createTextRun(__('result_improve_production'))->getFont()->setSize($this->headFontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $cell->createTextRun("$label")->getFont()->setSize($this->headFontSize)->setBold(true);
        }


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('slaughter_volume_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['slaktevolumHGkg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('average_salmon_price_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['lakseprisNOKPerKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('sales_value_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['salgsverdiNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('production_cost_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['prodkostKrPerkg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function optimizationSlide4(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->optimizationModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        //new table
        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('result_improve_production'))->getFont()->setSize($this->headFontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell);
            $label = isset($inputs['name_case' . $case]) ? $inputs['name_case' . $case] : 'Case ' . $case;
            $label = $label == 'Case ' . $case ? __(strtolower(str_replace(' ', '', $label))) : $label;
            $cell->createTextRun("$label")->getFont()->setSize($this->headFontSize)->setBold(true);
        }


        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('operating_profit_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['driftsResultatNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['dodelighetPercentage'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('biomass_deadfish_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['biomasseDodfiskKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun('eFCR')->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $tableViewResult['case' . $case]['efcr'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('additional_cost_improvement_production_nok_1000'))->getFont()->setSize(
            $this->fontSize
        );

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['merkostnadTiltakProduksjonNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('additional_cost_improvement_nok_per_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['merkostTiltakKrKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }


        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('additional_slaughter_in_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['merslaktKg'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('increased_profit_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['oktResultatNOK1000'];
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('gross_profit_margin'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell = $this->formatCell($cell, Fill::FILL_NONE);
            $text = $tableViewResult['case' . $case]['grossProfitMargin'] . '%';
            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
        }

//        $row = $table->createRow();
//        $row->setHeight($this->rowHeight);
//        $cell->setWidth($tableLabelCellTotalWidth);
//        $cell = $row->nextCell();
//        $cell = $this->formatCell($cell, Fill::FILL_NONE);
//        $cell->createTextRun(__('benefit_cost_ratio'))->getFont()->setSize($this->fontSize);
//
//        foreach ($this->pptData['caseNumbers'] as $case) {
//            $cell = $row->nextCell();
//            $cell->setWidth($cellWidth);
//            $cell = $this->formatCell($cell, Fill::FILL_NONE);
//            $text = $case == 1 ? '' : $tableViewResult['case' . $case]['nytteKostRatio2'];
//            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
//        }


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function optimizationGraph1(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->optimizationModelHeader($currentSlide);


        // graph 1

        $key = 'slaktevektRundKg';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_weight_at_slaughter_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY + 20,
            $min,
            0,
            0
        );


        // graph 2

        $key = 'slaktevolumHOGTonn';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('slaughter_volume_hog_tonn'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false,
            1
        );


        // graph 3

        $key = 'efcr';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('economic_feed_conversion_ratio_efcr'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY + 20,
            $min,
            0
        );


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function optimizationGraph2(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->optimizationModelHeader($currentSlide);


        // graph 1

        $key = 'prodkostPerKg';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('prod_cost_nok_per_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY + 20,
            $min,
            0,
            0
        );


        // graph 2

        $key = 'driftsResultatNOK1000';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('operating_profit_nok_1000'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false,
            0
        );


        // graph 3

        $key = 'LakseprisNOKPerKg';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_salmon_price_nok_kg'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY + 20,
            $min,
            0
        );


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function optimizationGraph3(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->optimizationModelHeader($currentSlide);


        //Nikto Radio
        $nkr1 = $graphResult['nytteKostRatio1'];
        $nkr2 = $graphResult['nytteKostRatio2'];

        unset($nkr1['Case1']);
        unset($nkr2['Case1']);


        $nkData = [
            'nytteKostRatio2' => $nkr2
        ];

        $nkLabels = [];
        foreach ($nkr1 as $case => $value) {
            $nkLabels[] = "'" . __(strtolower($case)) . "'";
        }

        $nkLabelsStr = implode(',', $nkLabels);
        $title = __('benefit_cost_ratio');
        $chart7 = PDFController::drawNikktoGraph($nkLabelsStr, $nkData, null, true, $title);
        $chart7 = urlencode($chart7);

        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $chart7;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('nikkto')
            ->setDescription('nikkto graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($this->g2FirstGraphOffsetX)
            ->setOffsetY($this->g2FirstGraphOffsetY);
        $currentSlide->addShape($shape);


        // Slide footer start

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function codSlide2(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = 2; //$totalCases + 1;
        $tableLabelCellTotalWidth = 250;
        $tableValueCellTotalWidth = 540;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->codModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        //$cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('basic_preconditions_in_the_model'))->getFont()->setSize(9)->setBold(true);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->createTextRun('')->getFont()->setSize($this->fontSize);


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('number_of_smolts'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = number_format($inputs['cost_of_disease_produksjonsmodell_antall_smolt_case1'], 0, '.', ' ');
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);

        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('salmon_price_nok_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $inputs['cost_of_disease_produksjonsmodell_laksepris_case1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('production_cost_nok_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = $inputs['cost_of_disease_produksjonsmodell_prod_kost_budsjett_case1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('smolt_weight_in_grams'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $inputs['cost_of_disease_grunnforutsetninger_budsjett_smoltvekt_gram_case1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 4


        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('average_weight_at_slaughter_hog_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = $tableViewResult['case1']['slaktevektHOGkg'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 5
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $tableViewResult['case1']['deadPercentage'] . '%';
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 6
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('estimated_total_cost_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = $tableViewResult['case1']['totalProdKostCase1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);

        // Row 7
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('variable_costs_in_percentage_of_total_production_cost'))->getFont()->setSize(
            $this->fontSize
        );

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $tableViewResult['case1']['totalVariableKost'] . '%';
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        //end
        // Create a Table


        $columnNumber = 2;

        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY + 340);


        //head 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('effects_disease_and_vaccine')))->getFont()->setSize(9)->setBold(true);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
        $cell->createTextRun($label)->getFont()->setSize(9)->setBold(true);


        //Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('reduced_weight_at_slaughter_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = number_format($inputs['cost_of_disease_effekter_sjukdom_redusert_slaktevekt_kg_case1'], 1);
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);


        //Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['cost_of_disease_effekter_sjukdom_kt_ddelighet_prosentpoeng_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        // Slide footer start

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function codSlide3(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = 2; //$totalCases + 1;
        $tableLabelCellTotalWidth = 250;
        $tableValueCellTotalWidth = 540;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $height = $this->rowHeight - 2;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->codModelHeader($currentSlide);

        // Create a Table


        $columnNumber = 2;

        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        //head 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('effects_of_disease')))->getFont()->setSize(9)->setBold(true);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
        $cell->createTextRun($label)->getFont()->setSize(9)->setBold(true);


        //Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('average_weight_of_increased_mortality_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['cost_of_disease_effekter_sjukdom_vekt_pa_ddfisk_case1'];
        $label = number_format($label, 1);
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        //Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('increased_bfcr'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['cost_of_disease_effekter_sjukdom_kt_bfcr_case1'];
        $label = number_format($label, 2);
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);


        //Row 3
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('increased_downgrade_production_quality_biomass'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['cost_of_disease_effekter_sjukdom_kt_nedklassing_prod_kvalitet_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);


        // row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('increased_downgrade_draft_biomass'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['cost_of_disease_effekter_sjukdom_utkast_poeng_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);


        //Row 4
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('extraordinary_costs_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['cost_of_disease_effekter_sjukdom_ekstraordinre_kostnader_nok_mill_case1'] * 1000;
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);


        //Row 5
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('treatment_costs_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['cost_of_disease_effekter_sjukdom_behandlingskostnad_nok_mill_case1'] * 1000;
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);


        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('costs_of_prophylactic_measures_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['cost_of_disease_effekter_sjukdom_forebygginskostnad_nok_mill_case1'] * 1000;
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);


        //Row 6
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('probability_of_disease'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['cost_of_disease_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        // Slide footer start

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function codSlide4(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 270;
        $tableValueCellTotalWidth = 520;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];
        $height = $this->rowHeight - 2;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->codModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        //start

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(strtoupper(__('production_result')))->getFont()->setSize(9)->setBold(true);


        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $label = '';
            if ($case == 1) {
                $label = isset($inputs['budget_name']) ? $inputs['budget_name'] : __('budget');
            } elseif ($case == 2) {
                $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
            } else {
            }

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize(9)->setBold(true);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('slaughter_weight_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['slaktevektHOGkg'];


            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('slaughter_volume_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['slaktevolumHOGKg'];

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('sales_value_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['salgsverdiNOK1000'];

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('production_cost_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['prodkostKrPerKg'];

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('operating_profit_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['driftsResultat'];

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['deadPercentage'] . '%';

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('biomass_deadfish_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['biomasseDeadfiskKg'];


            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('efcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['efcr'];

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('average_salmon_price_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['lakseprisGjennomsnittKrPerkg'];


            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('cost_of_disease_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = $tableViewResult['case' . $case]['kostnadVedSjukdom'];

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function codSlide5(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 270;
        $tableValueCellTotalWidth = 520;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];
        $height = $this->rowHeight - 2;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->codModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        //start

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(strtoupper(__('production_result')))->getFont()->setSize(9)->setBold(true);


        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $label = '';
            if ($case == 1) {
                $label = isset($inputs['budget_name']) ? $inputs['budget_name'] : __('budget');
            } elseif ($case == 2) {
                $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
            } else {
            }

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize(9)->setBold(true);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('lost_slaughter_volume_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['taptSlaktevolumeHOGKg'];
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('gross_profit_margin'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = $tableViewResult['case' . $case]['grossProfitMargin'] . '%';
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }


    private function codGraph1(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->codModelHeader($currentSlide);


        // graph 1

        $key = 'slaktevektRund';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_weight_at_slaughter_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0,
            0,
            false
        );


        // graph 2

        $key = 'tonnSloyd';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('slaughter_volume_hog_tonn'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false,
            1
        );


        // graph 3

        $key = 'efcr';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('economic_feed_conversion_ratio_efcr'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0
        );


        // Slide footer start

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function codGraph2(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->codModelHeader($currentSlide);


        // graph 1
        $key = 'prodkostPerKg';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('production_cost_nok_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0
        );


        // graph 2
        $key = 'driftsResultat';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('operating_profit_nok_1000'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            0,
            0,
            0,
            0,
            0
        );


        // graph 3

        $key = 'lakseprisGjennomsnittKrPerkg';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_salmon_price_nok_kg'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY
        );

        // Slide footer start

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function codGraph3(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->codModelHeader($currentSlide);


        // deadPercentage

        $key = 'deadPercentage';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('mortality_percentage'),
            $this->g2FirstGraphOffsetX,
            $this->g2FirstGraphOffsetY,
            $min,
            0,
            0,
            true,
            1
        );


        // sujkdom
        $sujdamDataArray = [];

        $caseStr = '';

        $biologiskeTapStr = '';
        $okteUtgifterStr = '';

        $vaks = ['VACC A', 'VACC B', 'VACC C'];
        foreach ($caseNumbers as $case) {
            if ($case == 1) {
                $caseStr .= '"Case' . $case . '",';
            }
            if ($case == 2) {
                $caseStr .= '"SAV3",';
            }
            if ($case >= 3) {
                $caseStr .= '"' . $vaks[$case - 3] . '",';
            }

            if ($case > 1) {
                $biologiskeTap = $graphResult['biologiskeTap']['Case' . $case];
                $biologiskeTapStr .= $biologiskeTap . ',';
                $okteUtgifter = $graphResult['okteUtgifter']['Case' . $case];
                $okteUtgifterStr .= $okteUtgifter . ',';

                $sujdamDataArray[] = $biologiskeTap;
                $sujdamDataArray[] = $okteUtgifter;
            }
        }


        $sujkdomLabels = explode(',', rtrim($caseStr, ','));
        unset($sujkdomLabels[0]);
        $sujkdomLabels = implode(',', $sujkdomLabels);
        $sujkdomStepSize = 4000;

        $arrayMaxAbs = max(
            array_map(
                function ($x) {
                    return abs($x);
                },
                $sujdamDataArray
            )
        );

        $suggestedMax = round($arrayMaxAbs + $arrayMaxAbs / 7);


        $chart7 = "{
        type: 'bar',
        data: {
                labels: [" . rtrim($sujkdomLabels, ',') . "],
                datasets: [{
                        label: 'biologiskeTap',
                        backgroundColor: ['rgba(21,115,195,255)', 'rgba(21,115,195,255)', 'rgba(21,115,195,255)', 'rgba(21,115,195,255)'],
                        data: [" . rtrim($biologiskeTapStr, ',') . "]
                    },{
                        label: 'okteUtgifter',
                        backgroundColor: ['rgb(199, 113, 0)', 'rgb(199, 113, 0)','rgb(199, 113, 0)','rgb(199, 113, 0)'],
                        data: [" . rtrim($okteUtgifterStr, ',') . "]
                    },],
        },
        options: {
            title: {
                display: true,
                text: '" . __('cost_of_disease_nok_1000') . "',
                fontSize:20
            },
            scales: {
                xAxes: [{
                    maxBarThickness: 100,
                    ticks: {
                        fontSize: '15'
                    },
                    offset: true,
                    gridLines: {
                        drawOnChartArea: false
                    },
                    stacked: true
                }],
                yAxes: [{
                    ticks: {
                        fontSize: '15',
                        suggestedMax: " . $suggestedMax . "
                    },
                    offset: false,
                    gridLines: {
                        drawOnChartArea: false
                    },
                    stacked: true,
                    minBarLength: 10
                }]
            },
            legend: {
                display: false
            },
            plugins: {
      datalabels: {
        formatter: function(value) {
            return parseFloat(value).toFixed(1).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');
        },
        anchor: 'center',
        align: " . $this->getPDFAlignCallback() . ",
        clamp: true,
        font: {
          weight: 'normal',
          size: 20,
        },
        color: " . $this->getPDFColorCallback() . "

      }
    }
        }
    }";


        $chart7 = urlencode($chart7);

        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $chart7;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('sujkdom')
            ->setDescription('sujkdom graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($this->g2SecondGraphOffsetX)
            ->setOffsetY($this->g2SecondGraphOffsetY);
        $currentSlide->addShape($shape);


        // Slide footer start

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    //end CoD
    private function vaccineSlide2(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = 2; //$totalCases + 1;
        $tableLabelCellTotalWidth = 250;
        $tableValueCellTotalWidth = 540;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->vaccineModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);

        //start


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        //$cell->setWidth($tableLabelCellTotalWidth);
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('basic_preconditions_in_the_model')))->getFont()->setSize(9)->setBold(true);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->createTextRun('')->getFont()->setSize($this->fontSize);


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('number_of_smolts'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = number_format($inputs['vaksinering_produksjonsmodell_antall_smolt_case1'], 0, '.', ' ');
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);

        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('salmon_price_nok_per_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $inputs['vaksinering_produksjonsmodell_laksepris_case1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 2

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('production_cost_nok_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = $inputs['vaksinering_produksjonsmodell_prod_kost_budsjett_case1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 3

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('smolt_weight_in_grams'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $inputs['vaksinering_grunnforutsetninger_budsjett_smoltvekt_gram_case1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 4


        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('average_weight_at_slaughter_hog_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = $tableViewResult['case1']['slaktevektHOGkg'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        // Row 5
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $tableViewResult['case1']['deadPercentage'] . '%';
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);

        // Row 6
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('estimated_total_cost_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $text = $tableViewResult['case1']['totalProdKostCase1'];
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);

        // Row 7
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('variable_costs_in_percentage_of_total_production_cost'))->getFont()->setSize(
            $this->fontSize
        );

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $text = $tableViewResult['case1']['totalVariableKost'] . '%';
        $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);


        //end
        // Create a Table

        $vaksCases = $totalCases - 2;
        $columnNumber = 2 + ($vaksCases * 2);

        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY + 320);


        //head 1
        $savWidth = 210 / $vaksCases;
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($this->tableWidth - ($savWidth + ($vaksCases * 130)));
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun('')->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell->setWidth($savWidth);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun('')->getFont()->setSize($this->fontSize);

        $vaks = [1 => 'vacc_a', 3 => 'vacc_b', 5 => 'vacc_c'];

        for ($i = 1; $i <= $vaksCases * 2; $i++) {
            $cell = $row->nextCell();

            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            if ($i % 2 != 0) {
                $cell->setWidth(60);
                $label = __($vaks[$i]);
                $cell->createTextRun($label)->getFont()->setSize(9);
            } else {
                $cell->setWidth(70);
                $cell->createTextRun('')->getFont()->setSize($this->fontSize);
            }
        }


        //head 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('effects_disease_and_vaccine')))->getFont()->setSize(9)->setBold(true);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
        $cell->createTextRun($label)->getFont()->setSize(7)->setBold(true);


        for ($i = 1; $i <= $vaksCases * 2; $i++) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_LEFT);

            if ($i % 2 != 0) {
                $label = __('rpp_percentage');

                $cell->createTextRun($label)->getFont()->setSize(7)->setBold(true);
            } else {
                $cell->createTextRun(strtoupper(__('bi_effect')))->getFont()->setSize(7)->setBold(true);
            }
        }

        //Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('reduced_weight_at_slaughter_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = number_format($inputs['vaksinering_effekter_sjukdom_redusert_slaktevekt_kg_case1'], 1);
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $label = $inputs['vaksinering_effekter_av_vaksine_tilvekst_kg_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_tilvekst_kg_bi_effekt_case' . $case];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        //Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['vaksinering_effekter_sjukdom_kt_ddelighet_prosentpoeng_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $label = $inputs['vaksinering_effekter_av_vaksine_ddelighet_poeng_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_ddelighet_poeng_bi_effekt_case' . $case];
            $label = round($label) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function vaccineSlide3(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = 2; //$totalCases + 1;
        $tableLabelCellTotalWidth = 250;
        $tableValueCellTotalWidth = 540;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->vaccineModelHeader($currentSlide);

        // Create a Table

        $vaksCases = $totalCases - 2;
        $columnNumber = 2 + ($vaksCases * 2);

        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        //head 1
        $savWidth = 210 / $vaksCases;
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($this->tableWidth - ($savWidth + ($vaksCases * 130)));
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun('')->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell->setWidth($savWidth);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun('')->getFont()->setSize($this->fontSize);

        $vaks = [1 => 'vacc_a', 3 => 'vacc_b', 5 => 'vacc_c'];

        for ($i = 1; $i <= $vaksCases * 2; $i++) {
            $cell = $row->nextCell();

            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            if ($i % 2 != 0) {
                $label = __($vaks[$i]);
                $cell->setWidth(60);
                $cell->createTextRun($label)->getFont()->setSize(9);
            } else {
                $cell->setWidth(75);
                $cell->createTextRun('')->getFont()->setSize($this->fontSize);
            }
        }


        //head 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(270);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(strtoupper(__('effects_disease_and_vaccine')))->getFont()->setSize(9)->setBold(true);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
        $cell->createTextRun($label)->getFont()->setSize(7)->setBold(true);


        for ($i = 1; $i <= $vaksCases * 2; $i++) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');


            if ($i % 2 != 0) {
                $label = __('rpp_percentage');
                $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setHorizontal(
                    Alignment::HORIZONTAL_CENTER
                );
                $cell->createTextRun($label)->getFont()->setSize(7)->setBold(true);
            } else {
                $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setHorizontal(
                    Alignment::HORIZONTAL_LEFT
                );
                $cell->createTextRun(strtoupper(__('bi_effect')))->getFont()->setSize(7)->setBold(true);
            }
        }

        //Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('average_weight_of_increased_mortality_kg'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['vaksinering_effekter_sjukdom_vekt_pa_ddfisk_case1'];
        $label = number_format($label, 1);
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = '';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = '';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        //Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('increased_bfcr'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['vaksinering_effekter_sjukdom_kt_bfcr_case1'];
        $label = number_format($label, 2);
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_bfcr_enhet_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_bfcr_enhet_bi_effekt_case' . $case];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        //Row 3
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('increased_downgrade_production_quality_biomass'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['vaksinering_effekter_sjukdom_kt_nedklassing_prod_kvalitet_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_produksjon_poeng_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_produksjon_poeng_bi_effekt_case' . $case];
            $label = round($label) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('increased_downgrade_draft_biomass'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['vaksinering_effekter_sjukdom_utkast_poeng_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_utkast_poeng_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_utkast_poeng_bi_effekt_case' . $case];
            $label = round($label) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row 4
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('extraordinary_costs_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['vaksinering_effekter_sjukdom_ekstraordinre_kostnader_nok_mill_case1'] * 1000;
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_ekstraordinre_kostnader_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_ekstraordinre_kostnader_rpp_case' . $case];
            $cell->createTextRun('')->getFont()->setSize($this->fontSize);
        }


        //Row 5
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('treatment_costs_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['vaksinering_effekter_sjukdom_behandlingskostnad_nok_mill_case1'] * 1000;
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_behandling_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_behandling_rpp_case' . $case];
            $cell->createTextRun('')->getFont()->setSize($this->fontSize);
        }


        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $cell->createTextRun(__('costs_of_prophylactic_measures_nok_1000'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, FILL::FILL_NONE);
        $label = $inputs['vaksinering_effekter_sjukdom_forebygginskostnad_nok_mill_case1'] * 1000;
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_forebygging_rpp_case' . $case];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_av_vaksine_forebygging_rpp_case' . $case];
            $cell->createTextRun('')->getFont()->setSize($this->fontSize);
        }

        //Row 6
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth(250);
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->createTextRun(__('probability_of_disease'))->getFont()->setSize($this->fontSize);

        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_SOLID);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $label = $inputs['vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
        $label = number_format($label, 1) . '%';
        $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            if ($case < 3) {
                continue;
            }

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);

            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, Fill::FILL_SOLID);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(0)->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $label = $inputs['vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
            $label = number_format($label, 1) . '%';
            $cell->createTextRun('')->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function vaccineSlide4(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 270;
        $tableValueCellTotalWidth = 520;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];
        $height = $this->rowHeight - 2;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->vaccineModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        //start

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(strtoupper(__('production_result')))->getFont()->setSize(9)->setBold(true);


        $vaks = ['vacc_a', 'vacc_b', 'vacc_c'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $label = '';
            if ($case == 1) {
                $label = isset($inputs['budget_name']) ? $inputs['budget_name'] : __('budget');
            } elseif ($case == 2) {
                $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
            } else {
                $label = __($vaks[$case - 3]);
            }

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize(9)->setBold(true);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('slaughter_weight_round_kg'))->getFont()->setSize($this->fontSize);


        $vaks = ['VACC A', 'VACC B', 'VACC C'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['slaktevektRundvektKg'];


            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('number_of_harvested'))->getFont()->setSize($this->fontSize);


        $vaks = ['VACC A', 'VACC B', 'VACC C'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['slaktetAntall'];

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('slaughter_weight_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['slaktevektHOGkg'];


            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('slaughter_volume_hog_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['slaktevolumHOGKg'];

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('sales_value_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['salgsverdiNOK1000'];

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('production_cost_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['prodkostKrPerKg'];

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('operating_profit_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['driftsResultat'];

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

        $cell->createTextRun(__('gross_profit_margin'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = $tableViewResult['case' . $case]['grossProfitMargin'] . '%';
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


//        $cell->createTextRun(__('benefit_cost_ratio'))->getFont()->setSize($this->fontSize);
//
//        foreach ($this->pptData['caseNumbers'] as $case) {
//            $cell = $row->nextCell();
//            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
//            $label = $case <= 2 ? '' : $tableViewResult['case' . $case]['nytteKostRatio2'];
//            $cell->getBorders()->getTop()->setLineWidth(0);
//            $cell->getBorders()->getRight()->setLineWidth(0);
//            $cell->getBorders()->getBottom()->setLineWidth(0);
//            $cell->getBorders()->getLeft()->setLineWidth(0);
//            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
//            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
//        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_NONE);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['deadPercentage'] . '%';

            $cell->getFill()->setFillType(Fill::FILL_NONE);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('biomass_deadfish_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = $tableViewResult['case' . $case]['biomasseDeadfiskKg'];
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_NONE);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('efcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['efcr'];
            $cell->getFill()->setFillType(Fill::FILL_NONE);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function vaccineSlide5(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 270;
        $tableValueCellTotalWidth = 520;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];
        $inputs = $this->pptData['inputs'];
        $height = $this->rowHeight - 2;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->vaccineModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        //start

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(strtoupper(__('production_result')))->getFont()->setSize(9)->setBold(true);


        $vaks = ['vacc_a', 'vacc_b', 'vacc_c'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $label = '';
            if ($case == 1) {
                $label = isset($inputs['budget_name']) ? $inputs['budget_name'] : __('budget');
            } elseif ($case == 2) {
                $label = isset($inputs['block_sjukdom_name']) ? $inputs['block_sjukdom_name'] : 'SAV3';
            } else {
                $label = __($vaks[$case - 3]);
            }

            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize(9)->setBold(true);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('average_salmon_price_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['lakseprisGjennomsnittKrPerkg'];


            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('cost_of_disease_nok_1000'))->getFont()->setSize($this->fontSize);


        $vaks = ['VACC A', 'VACC B', 'VACC C'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = $tableViewResult['case' . $case]['kostnadVedSjukdom'];

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(' ' . __('increased_expenses_nok_1000'))->getFont()->setSize($this->fontSize);


        $vaks = ['VACC A', 'VACC B', 'VACC C'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['okteUtgifterNOK1000'];

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun('  ' . __('biological_losses_nok_1000'))->getFont()->setSize($this->fontSize);


        $vaks = ['VACC A', 'VACC B', 'VACC C'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $label = $tableViewResult['case' . $case]['biologiskeTapNOK1000'];
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($height);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('lost_slaughter_volume_hog_kg'))->getFont()->setSize($this->fontSize);


        $vaks = ['VACC A', 'VACC B', 'VACC C'];
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $label = $tableViewResult['case' . $case]['taptSlaktevolumeHOGKg'];
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function vaccineGraph1(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->vaccineModelHeader($currentSlide);


        // graph 1

        $key = 'slaktevektRund';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_weight_at_slaughter_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0,
            0,
            false
        );


        // graph 2

        $key = 'tonnSloyd';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('slaughter_volume_hog_tonn'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false,
            1
        );


        // graph 3

        $key = 'efcr';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('economic_feed_conversion_ratio_efcr'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0
        );


        // Slide footer start

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function vaccineGraph2(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->vaccineModelHeader($currentSlide);


        // graph 1
        $key = 'prodkostPerKg';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('production_cost_nok_kg'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0
        );


        // graph 2
        $key = 'driftsResultat';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('operating_profit_nok_1000'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            0,
            0,
            0,
            0,
            0
        );


        // graph 3

        $key = 'lakseprisGjennomsnittKrPerkg';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('average_salmon_price_nok_kg'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY
        );

        // Slide footer start

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function vaccineGraph3(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->vaccineModelHeader($currentSlide);


        // deadPercentage

        $key = 'deadPercentage';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('mortality_percentage'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0,
            0,
            true,
            1
        );


        // sujkdom
        $sujdamDataArray = [];

        $caseStr = '';

        $biologiskeTapStr = '';
        $okteUtgifterStr = '';

        $vaks = ['vacc_a', 'vacc_b', 'vacc_c'];
        foreach ($caseNumbers as $case) {
            if ($case == 1) {
                $caseStr .= '"Case' . $case . '",';
            }
            if ($case == 2) {
                $caseStr .= '"SAV3",';
            }
            if ($case >= 3) {
                $caseStr .= '"' . __($vaks[$case - 3]) . '",';
            }

            if ($case > 1) {
                $biologiskeTap = $graphResult['biologiskeTap']['Case' . $case];
                $biologiskeTapStr .= $biologiskeTap . ',';
                $okteUtgifter = $graphResult['okteUtgifter']['Case' . $case];
                $okteUtgifterStr .= $okteUtgifter . ',';

                $sujdamDataArray[] = $biologiskeTap;
                $sujdamDataArray[] = $okteUtgifter;
            }
        }


        $sujkdomLabels = explode(',', rtrim($caseStr, ','));
        unset($sujkdomLabels[0]);
        $sujkdomLabels = implode(',', $sujkdomLabels);
        $sujkdomStepSize = 4000;

        $arrayMaxAbs = max(
            array_map(
                function ($x) {
                    return abs($x);
                },
                $sujdamDataArray
            )
        );

        $suggestedMax = round($arrayMaxAbs + $arrayMaxAbs / 7);

        $minBarLength = $suggestedMax ? 10 : 0;
        $suggestedMax = $suggestedMax ? $suggestedMax : 1;


        $chart7 = "{
        type: 'bar',
        data: {
                labels: [" . rtrim($sujkdomLabels, ',') . "],
                datasets: [{
                        label: 'biologiskeTap',
                        backgroundColor: ['rgba(21,115,195,255)', 'rgba(21,115,195,255)', 'rgba(21,115,195,255)', 'rgba(21,115,195,255)'],
                        data: [" . rtrim($biologiskeTapStr, ',') . "]
                    },{
                        label: 'okteUtgifter',
                        backgroundColor: ['rgb(199, 113, 0)', 'rgb(199, 113, 0)','rgb(199, 113, 0)','rgb(199, 113, 0)'],
                        data: [" . rtrim($okteUtgifterStr, ',') . "]
                    },],
        },
        options: {
            title: {
                display: true,
                text: '" . __('cost_of_disease_nok_1000') . "',
                fontSize:20
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: '15'
                    },
                    offset: true,
                    gridLines: {
                        drawOnChartArea: false
                    },
                    stacked: true
                }],
                yAxes: [{
                    ticks: {
                        fontSize: '15',
                        suggestedMax: " . $suggestedMax . "
                    },
                    offset: false,
                    gridLines: {
                        drawOnChartArea: false
                    },
                    stacked: true,
                    minBarLength: " . $minBarLength . "
                }]
            },
            legend: {
                display: false
            },
            plugins: {
      datalabels: {
        formatter: function(value) {
            return parseFloat(value).toFixed(1).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');
        },
        anchor: 'center',
        align: " . $this->getPDFAlignCallback() . ",
        clamp: true,
        font: {
          weight: 'normal',
          size: 20,
        },
        color: " . $this->getPDFColorCallback() . "

      }
    }
        }
    }";


        $chart7 = urlencode($chart7);

        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $chart7;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('sujkdom')
            ->setDescription('sujkdom graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($this->g2SecondGraphOffsetX)
            ->setOffsetY($this->g2SecondGraphOffsetY);
        $currentSlide->addShape($shape);


        //Nikto
        // Nikto graph

        //Nikto Radio
        $nkr1 = $graphResult['nytteKostRatio1'];
        $nkr2 = $graphResult['nytteKostRatio2'];

        unset($nkr1['Case1']);
        unset($nkr1['Case2']);
        unset($nkr2['Case1']);
        unset($nkr2['Case2']);

        $nkData = [
            'nytteKostRatio2' => $nkr2
        ];

        $nkLabels = [];
        foreach ($caseNumbers as $case) {
            if ($case == 1 || $case == 2) {
                continue;
            }

            $nkLabels[] = "'" . __($vaks[$case - 3]) . "'";
        }

        $nkLabelsStr = implode(',', $nkLabels);
        $nkColors = PDFController::getCaseColors();
        $nkColors = array_slice($nkColors, 2);

        $title = __('benefit_cost_ratio');
        $chart8 = PDFController::drawNikktoGraph($nkLabelsStr, $nkData, $nkColors, true, $title);
        $chart8 = urlencode($chart8);

        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $chart8;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('sujkdom')
            ->setDescription('sujkdom graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($this->g3ThirdGraphOffsetX)
            ->setOffsetY($this->g3ThirdGraphOffsetY);

        $currentSlide->addShape($shape);


        // Slide footer start

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private static function getPDFColorCallback()
    {
        $callback = "function(context) {

            var index = context.dataIndex;
            var value = parseFloat(context.dataset.data[index]);

            var ticks = context.chart.scales['y-axis-0'].ticksAsNumbers;

            var min = Math.min.apply(null, ticks.map(Math.abs));
            var max = Math.max.apply(null, ticks.map(Math.abs));
            var stepSize = Math.abs(ticks[0])- Math.abs(ticks[1]);

            var hasZeroinYaxis = ticks.filter(function(x){
                return Boolean(x) === false;
            }).length;

            var baseValue = hasZeroinYaxis ? Math.abs(value) : Math.abs(Math.abs(value) - min);

            if(baseValue < Math.abs(stepSize)){
                return 'black';
            }

            return 'white';

        }";

        return $callback;
    }

    private static function getPDFAlignCallback()
    {
        $callback = "function(context) {
            var index = context.dataIndex;
            var value = parseFloat(context.dataset.data[index]);

            var ticks = context.chart.scales['y-axis-0'].ticksAsNumbers;

            var min = Math.min.apply(null, ticks.map(Math.abs));
            var max = Math.max.apply(null, ticks.map(Math.abs));
            var stepSize = Math.abs(ticks[0])- Math.abs(ticks[1]);

            var hasZeroinYaxis = ticks.filter(function(x){
                return Boolean(x) === false;
            }).length;

            var baseValue = hasZeroinYaxis ? Math.abs(value) : Math.abs(Math.abs(value) - min);

            if(baseValue < Math.abs(stepSize)){

            if(value < 0)
                return 'bottom';
            else
                return 'top';
            }


            return 'center';
        }";

        return $callback;
    }
    //end of vaccine model

    //feed model
    private function feedModelHeader(&$currentSlide)
    {
        $headerData =
            [
                'site' => $this->pptData['tableViewResult']['case1']['lokalitet'],
                'generation' => $this->pptData['tableViewResult']['case1']['generasjon'],
                'name' => $this->pptData['tableViewResult']['case1']['ansvarlig']
            ];

        $this->slideHeader($currentSlide, $headerData);
    }

    private function codModelFooter(&$currentSlide, $slideNumber)
    {
        $totalSlides = 8;
        $this->slideFooter($currentSlide, $slideNumber, $totalSlides);
    }

    private function vaccineModelFooter(&$currentSlide, $slideNumber)
    {
        $totalSlides = 7;
        $this->slideFooter($currentSlide, $slideNumber, $totalSlides);
    }

    private function feedModelFooter(&$currentSlide, $slideNumber)
    {
        $totalSlides = 7;
        $this->slideFooter($currentSlide, $slideNumber, $totalSlides);
    }

    private function feedSlide2(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->feedModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY - 20);


        //start

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('basic_preconditions'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun('')->getFont()->setSize($this->fontSize);
        }


        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_NONE);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('release_date'))->getFont()->setSize($this->fontSize);
        $i = 1;
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_NONE);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

            $text = '';
            if ($i == 1) {
                $text = $tableViewResult['case1']['utsettsDato'];
            }

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
            $i++;
        }


        // Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('exposure_weight'))->getFont()->setSize($this->fontSize);
        $i = 1;
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

            $text = '';
            if ($i == 1) {
                $text = $tableViewResult['case1']['utsettsVekt'];
            }

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
            $i++;
        }

        // Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_NONE);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('number_of_smolts'))->getFont()->setSize($this->fontSize);
        $i = 1;
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_NONE);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

            $text = '';
            if ($i == 1) {
                $text = $tableViewResult['case1']['antallSmolt'];
            }

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
            $i++;
        }


        // Row 3
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('harvest_date'))->getFont()->setSize($this->fontSize);
        $i = 1;
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

            $text = '';
            if ($i == 1) {
                $text = $tableViewResult['case1']['slakteDato'];
            }

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
            $i++;
        }
        // Row 4
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_NONE);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('days_in_production'))->getFont()->setSize($this->fontSize);
        $i = 1;
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_NONE);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

            $text = '';
            if ($i == 1) {
                $text = $tableViewResult['case1']['dagerIProduksjon'];
            }

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
            $i++;
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('estimated_total_cost_nok_1000'))->getFont()->setSize($this->fontSize);
        $i = 1;
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

            $text = '';
            if ($i == 1) {
                $text = $tableViewResult['case1']['totalProdKostCase1'];
            }

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
            $i++;
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_NONE);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('variable_costs_in_percentage_of_total_production_cost'))->getFont()->setSize(
            $this->fontSize
        );
        $i = 1;
        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_NONE);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);

            $text = '';
            if ($i == 1) {
                $text = $tableViewResult['case1']['totalVariableKost'];
            }

            $cell->createTextRun("$text")->getFont()->setSize($this->fontSize);
            $i++;
        }


        //end

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('production'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun(__('case') . ' ' . $case)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }

        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('harvest_weight') . ' (g)')->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['slaktevekt'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('vf3'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['vf3'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row 3
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('growth') . ' (kg)')->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['tilvekstKg'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Slide footer start

        $this->feedModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }


    private function feedSlide3(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->feedModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('production'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun(__('case') . ' ' . $case)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }

        // Row 4
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('slaughtered_biomass_net') . ' (tonn)')->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();

            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['slaktetBiomasseNettoTonn'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('mortality_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $label = $tableViewResult['case' . $case]['mortality'] . '%';
            $cell->createTextRun($label)->getFont()->setSize(
                $this->fontSize
            );
        }

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('feed'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun(__('case') . ' ' . $case)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }

        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('bfcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['bfcr'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('efcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['efcr'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row 3
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('amount_of_feed') . ' (kg)')->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['FormengdeKg'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row 4
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('feed_costs_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['forkostMill'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('economy'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun(__('case') . ' ' . $case)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }

        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('feed_price_per_kg_of_feed'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['forprisPerKgFor'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('feed_costs_nok_per_kg_produced'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['forkostPerKgProdusert'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row 3
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('prod_cost_nok_per_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['prodkostPerKg'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Slide footer start

        $this->feedModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function feedSlide4(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->feedModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('economy'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun(__('case') . ' ' . $case)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }


        // Row 4
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('revenues_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['inntekterMill'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row 5
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        //$cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('costs_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            //$cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['kostnaderMill'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row 6
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('operating_profit_nok_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['driftsResultatMill'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row 7
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        //$cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('margin_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            //$cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['marginPercentage'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row 8
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('benefit_cost_ratio'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['kostNytteRatio2'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Slide footer start

        $this->feedModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }


    private function feedGraphSlide1(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->feedModelHeader($currentSlide);


        // graph 1

        $key = 'slaktevektRund';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('harvest_weight_round_gram'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0,
            0,
            false,
            0
        );


        // graph 2

        $key = 'tonnSloyd';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('slaughter_volume_hog_tonn'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false,
            1
        );


        // graph 3

        $key = 'efcr';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('economic_feed_conversion_ratio_efcr'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0
        );


        // Slide footer start

        $this->feedModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function feedGraphSlide2(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->feedModelHeader($currentSlide);


        // graph 1

        $key = 'forprisPerKgFor';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('feed_price_per_kg_of_feed'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0
        );


        // graph 2

        $key = 'prodkostPerKg';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('prod_cost_nok_per_kg'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0
        );


        // graph 3

        $key = 'driftsResultat';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('operating_profit_nok_mill'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0
        );


        // Slide footer start

        $this->feedModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function feedGraphSlide3(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $vektutviklingValue = $this->pptData['vektutviklingValue'];
        $graphFontSize = round(12 / count($caseNumbers)) + 6;
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->feedModelHeader($currentSlide);


        $key = 'forkostPerKg';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('feed_costs_nok_per_kg_produced'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0
        );


        $key = 'mortality';
        $data = $this->getFeedData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            __('mortality_percentage'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            true
        );


        //Nikto Radio
        $nkr1 = $graphResult['nytteKostRatio'];
        $nkr2 = $graphResult['nytteKostRatio2'];

        unset($nkr1['Case1']);
        unset($nkr2['Case1']);


        $nkData = [
            'nytteKostRatio2' => $nkr2
        ];

        $nkLabels = [];
        foreach ($nkr1 as $case => $value) {
            $nkLabels[] = "'" . __(strtolower($case)) . "'";
        }

        $nkLabelsStr = implode(',', $nkLabels);
        $chart7 = PDFController::drawNikktoGraph($nkLabelsStr, $nkData, null, true, __('benefit_cost_ratio'));
        $chart7 = urlencode($chart7);

        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $chart7;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('nikkto')
            ->setDescription('nikkto graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($this->g3ThirdGraphOffsetX)
            ->setOffsetY($this->g3ThirdGraphOffsetY);
        $currentSlide->addShape($shape);

        // Slide footer start

        $this->feedModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function feedGraphSlide4(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $vektutviklingValue = $this->pptData['vektutviklingValue'];
        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        $this->feedModelHeader($currentSlide);


        // graph 9

        //$image_url = 'https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20%22type%22%3A%20%22bar%22%2C%0A%20%20%22data%22%3A%20%7B%0A%20%20%20%20%22labels%22%3A%20%5B%0A%20%20%20%20%20%20%22January%22%2C%0A%20%20%20%20%20%20%22February%22%2C%0A%20%20%20%20%20%20%22March%22%2C%0A%20%20%20%20%20%20%22April%22%2C%0A%20%20%20%20%20%20%22May%22%2C%0A%20%20%20%20%20%20%22June%22%2C%0A%20%20%20%20%20%20%22July%22%0A%20%20%20%20%5D%2C%0A%20%20%20%20%22datasets%22%3A%20%5B%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22label%22%3A%20%22Dataset%201%22%2C%0A%20%20%20%20%20%20%20%20%22backgroundColor%22%3A%20%22rgba(255%2C%2099%2C%20132%2C%200.5)%22%2C%0A%20%20%20%20%20%20%20%20%22borderColor%22%3A%20%22rgb(255%2C%2099%2C%20132)%22%2C%0A%20%20%20%20%20%20%20%20%22borderWidth%22%3A%201%2C%0A%20%20%20%20%20%20%20%20%22data%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20-31%2C%0A%20%20%20%20%20%20%20%20%20%20-70%2C%0A%20%20%20%20%20%20%20%20%20%20-30%2C%0A%20%20%20%20%20%20%20%20%20%20-33%2C%0A%20%20%20%20%20%20%20%20%20%20-9%2C%0A%20%20%20%20%20%20%20%20%20%2014%2C%0A%20%20%20%20%20%20%20%20%20%20-41%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22label%22%3A%20%22Dataset%202%22%2C%0A%20%20%20%20%20%20%20%20%22backgroundColor%22%3A%20%22rgba(54%2C%20162%2C%20235%2C%200.5)%22%2C%0A%20%20%20%20%20%20%20%20%22borderColor%22%3A%20%22rgb(54%2C%20162%2C%20235)%22%2C%0A%20%20%20%20%20%20%20%20%22borderWidth%22%3A%201%2C%0A%20%20%20%20%20%20%20%20%22data%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%2073%2C%0A%20%20%20%20%20%20%20%20%20%2041%2C%0A%20%20%20%20%20%20%20%20%20%2029%2C%0A%20%20%20%20%20%20%20%20%20%2061%2C%0A%20%20%20%20%20%20%20%20%20%20-65%2C%0A%20%20%20%20%20%20%20%20%20%2059%2C%0A%20%20%20%20%20%20%20%20%20%2038%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%20%20%7D%2C%0A%20%20%22options%22%3A%20%7B%0A%20%20%20%20%22responsive%22%3A%20true%2C%0A%20%20%20%20%22legend%22%3A%20%7B%0A%20%20%20%20%20%20%22position%22%3A%20%22top%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%22title%22%3A%20%7B%0A%20%20%20%20%20%20%22display%22%3A%20true%2C%0A%20%20%20%20%20%20%22text%22%3A%20%22Chart.js%20Bar%20Chart%22%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D';

        $gData = PDFController::feedSukdomGraph();
        $gData = urlencode($gData);
        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $gData;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('Vektutvikling graph logo')
            ->setDescription('Vektutvikling graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight + 200)
            ->setWidth($this->graphShapeWidth + 300)
            ->setOffsetX($this->g3ThirdGraphOffsetX)
            ->setOffsetY($this->g3ThirdGraphOffsetY - 200);
        $currentSlide->addShape($shape);

        // Slide footer start

        $this->feedModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    //end feed model


    //start MTB model
    private function slide2(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);


        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        // Table head
        $row = $table->createRow();

//        $cellBGColorObj = new Color();
//        $cellBGColorObj->setColor(new StyleColor('FFF'));

        $cell = $row->nextCell();

        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)
            ->getStartColor()
            ->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('variables'))->getFont()->setSize($this->fontSize)->setBold(true);

        $modelCaseText = $this->pptData['modelCaseText'];

        // iterate as per case numbers
        foreach ($this->pptData['caseNumbers'] as $case) {
            $caseText = isset($modelCaseText['case' . $case]) ? $modelCaseText['case' . $case] : __('case') . ' ' . $case;
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)
                ->getStartColor()
                ->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($caseText)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }

        // Row 1
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();

        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('number_of_licenses'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case1']['antallKons'])->getFont()->setSize($this->fontSize);
        }

        // Row 2
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);

        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)
            ->getStartColor()
            ->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('available_mtb_tons'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['tilgjengeligMTBTonn'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('production'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun('')->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('mtb_utilization_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['mtbUtnytting'] . '%')->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('average_temp_c'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['snitttemp'])->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('smolt_weight_in_grams'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['smoltvektGram'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('average_weight_at_slaughter_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['slaktevektRundKg'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Empty Row
        $row = $table->createRow();
        $row->setHeight($this->emptyRowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->createTextRun(" ");

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun(" ");
        }


        // Slide footer start

        $this->MTBModelFooter($currentSlide, 1);
    }

    private function slide3(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        // Table head
        $row = $table->createRow();

        $cellBGColorObj = new Color();
        $cellBGColorObj->setColor(new StyleColor('FFF'));

        $cell = $row->nextCell();

        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('biology'))->getFont()->setSize($this->fontSize)->setBold(true);

        $modelCaseText = $this->pptData['modelCaseText'];

        // iterate as per case numbers
        foreach ($this->pptData['caseNumbers'] as $case) {
            $caseText = isset($modelCaseText['case' . $case]) ? $modelCaseText['case' . $case] : __('case') . ' ' . $case;
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($caseText)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('increased_vf3'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['vf3'])->getFont()->setSize($this->fontSize);
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('bfcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['bfcr'])->getFont()->setSize($this->fontSize);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('waste_percentage_biomass_per_month'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['svinnBiomassePerMnd'] . '%')->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('downgrade_production_quality_percentage_biomass'))->getFont()->setSize(
            $this->fontSize
        );

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['nedklassingProdBiomasse'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('draft_percentage_biomass'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['utkastBiomasse'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row 3
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('costs_and_prices'))->getFont()->setSize($this->fontSize)->setBold(true);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->createTextRun('');
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('smolt_cost_nok_per_fish'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['smoltPrisNOKPerStk'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('feed_cost_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['forprisNokPerKg'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('dead_fish_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['dodfiskNokPerKg'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('well_boat_and_harvest_cost_per_kg_hog'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['innkjoringOgSlaktPerKgHOG'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('cost_prod_qual_nok_per_kg_hog'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['prodkvalitetRedusertPrisPerKg'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('salmon_price'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['laksepris'])->getFont()->setSize($this->fontSize);
        }

        // Slide footer start

        $this->MTBModelFooter($currentSlide, 2);
    }

    private function slide4(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        // Table head
        $row = $table->createRow();

        $cellBGColorObj = new Color();
        $cellBGColorObj->setColor(new StyleColor('FFF'));

        $cell = $row->nextCell();

        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('result'))->getFont()->setSize($this->fontSize)->setBold(true);

        $modelCaseText = $this->pptData['modelCaseText'];

        // iterate as per case numbers
        foreach ($this->pptData['caseNumbers'] as $case) {
            $caseText = isset($modelCaseText['case' . $case]) ? $modelCaseText['case' . $case] : __('case') . ' ' . $case;
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($caseText)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('tons_per_cone_per_year'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['tonnPerKonsPerAr'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('tons_per_company_hog'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['tonnPerSelsKapHOG'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('increased_production_per_year_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cellValue = $case == 1 ? '' : $tableViewResult['case' . $case]['oktProduksjonPerAr'] . '%';
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($cellValue)->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('produced_sea_tons'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['produsertSjoTonn'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_NONE);
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('sales_revenues_nok_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_NONE);
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['salgsinntekterNOK1000'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('total_costs_nok_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['sumKostnaderNOK1000'])->getFont()->setSize(
                $this->fontSize
            );
        }


        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('result_nok_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($tableViewResult['case' . $case]['resultatNOK1000'])->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('increased_result_nok_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cellValue = $case == 1 ? '' : $tableViewResult['case' . $case]['oktResultatNOK1000'];
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($cellValue)->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('improved_profit_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cellValue = $case == 1 ? '' : $tableViewResult['case' . $case]['forbedringResultatPercentage'] . '%';
            $cell = $row->nextCell();
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($cellValue)->getFont()->setSize(
                $this->fontSize
            );
        }

        // Row

        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('gross_profit_margin'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cellValue = $tableViewResult['case' . $case]['grossProfitMargin'] . '%';
            $cell = $row->nextCell();
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($cellValue)->getFont()->setSize(
                $this->fontSize
            );
        }

//        $row = $table->createRow();
//        $row->setHeight($this->rowHeight);
//        $cell = $row->nextCell();
//        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
//        $cell->getBorders()->getTop()->setLineWidth(0);
//        $cell->getBorders()->getRight()->setLineWidth(0);
//        $cell->getBorders()->getBottom()->setLineWidth(0);
//        $cell->getBorders()->getLeft()->setLineWidth(0);
//
//        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
//        $cell->createTextRun(__('benefit_cost_ratio'))->getFont()->setSize($this->fontSize);
//
//        foreach ($this->pptData['caseNumbers'] as $case) {
//            $cellValue = $case == 1 ? '' : $tableViewResult['case' . $case]['nytteKostRatio2'];
//            $cell = $row->nextCell();
//            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
//            $cell->getBorders()->getTop()->setLineWidth(0);
//            $cell->getBorders()->getRight()->setLineWidth(0);
//            $cell->getBorders()->getBottom()->setLineWidth(0);
//            $cell->getBorders()->getLeft()->setLineWidth(0);
//            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
//            $cell->createTextRun($cellValue)->getFont()->setSize(
//                $this->fontSize
//            );
//        }


        // Slide footer start

        $this->MTBModelFooter($currentSlide, 3);
    }

    private function slide5(&$objPHPPowerPoint)
    {
        $totalCases = count($this->pptData['caseNumbers']);
        $columnNumber = $totalCases + 1;
        $tableLabelCellTotalWidth = 350;
        $tableValueCellTotalWidth = 440;
        $cellWidth = $tableValueCellTotalWidth / $totalCases;

        $tableViewResult = $this->pptData['tableViewResult'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // Create a Table
        $table = $currentSlide->createTableShape($columnNumber)
            ->setHeight($this->tableHeight)
            ->setWidth($this->tableWidth)
            ->setOffsetX($this->slideOffsetX)
            ->setOffsetY($this->tableOffsetY);


        // Table head
        $row = $table->createRow();

        $cellBGColorObj = new Color();
        $cellBGColorObj->setColor(new StyleColor('FFF'));

        $cell = $row->nextCell();

        $cell->setWidth($tableLabelCellTotalWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);

        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('result'))->getFont()->setSize($this->fontSize)->setBold(true);

        $modelCaseText = $this->pptData['modelCaseText'];

        // iterate as per case numbers
        foreach ($this->pptData['caseNumbers'] as $case) {
            $caseText = isset($modelCaseText['case' . $case]) ? $modelCaseText['case' . $case] : __('case') . ' ' . $case;
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $cell->createTextRun($caseText)->getFont()->setSize($this->boldFontSize)->setBold(true);
        }

        // Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('production_cost_nok_kg'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $label = $tableViewResult['case' . $case]['prodkostPerKgHOG'];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($cellWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('average_salmon_price_nok_per_kg_hog'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $label = $tableViewResult['case' . $case]['snittLakseprisNokPerKgHog'];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('smolt_per_cons_per_year_1000'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $label = $tableViewResult['case' . $case]['smoltPerKonsPerAr1000'];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($cellWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('smolt_per_year_company_mill'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $label = $tableViewResult['case' . $case]['smoltPerArSelskapMill'];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('efcr'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $label = $tableViewResult['case' . $case]['eFCR'];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($cellWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('dead_fish_ton_per_year'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $label = $tableViewResult['case' . $case]['dodfiskTonnPerAr'];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('deaths_per_gene_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $label = $tableViewResult['case' . $case]['dodePerGen'] . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($cellWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('days_at_sea'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $label = $tableViewResult['case' . $case]['dagerISjø'];
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }

        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell = $this->formatCell($cell, Fill::FILL_NONE);
        $cell->createTextRun(__('reduced_days_in_sea'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell = $this->formatCell($cell, FILL::FILL_NONE);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $label = $case == 1 ? '' : (($tableViewResult['case' . $case]['reduserteDager'] == 0) ? '-' : $tableViewResult['case' . $case]['reduserteDager']);
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        //Row
        $row = $table->createRow();
        $row->setHeight($this->rowHeight);
        $cell = $row->nextCell();
        $cell->setWidth($cellWidth);
        $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
        $cell->getBorders()->getTop()->setLineWidth(0);
        $cell->getBorders()->getRight()->setLineWidth(0);
        $cell->getBorders()->getBottom()->setLineWidth(0);
        $cell->getBorders()->getLeft()->setLineWidth(0);
        $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
        $cell->createTextRun(__('reduction_risk_time_percentage'))->getFont()->setSize($this->fontSize);

        foreach ($this->pptData['caseNumbers'] as $case) {
            $cell = $row->nextCell();
            $cell->setWidth($cellWidth);
            $cell->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF');
            $cell->getBorders()->getTop()->setLineWidth(0);
            $cell->getBorders()->getRight()->setLineWidth(0);
            $cell->getBorders()->getBottom()->setLineWidth(0);
            $cell->getBorders()->getLeft()->setLineWidth(0);
            $cell->getActiveParagraph()->getAlignment()->setMarginLeft(5)->setVertical(Alignment::VERTICAL_CENTER);
            $label = $case == 1 ? '' : $tableViewResult['case' . $case]['reduksjonRisikotid'] . '%';
            $cell->createTextRun($label)->getFont()->setSize($this->fontSize);
        }


        // Slide footer start

        $this->MTBModelFooter($currentSlide, 4);
    }

    private function graphSlide1(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

//        $modelCaseText = $this->pptData['modelCaseText'];
//        $caseText = isset( $modelCaseText['case'.$case] ) ?  $modelCaseText['case'.$case] : __('case') . ' ' . $case;

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // graph 1

        $key = 'tonnPerKonsPerAr';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            __('tons_per_cone_per_year'),
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0,
            0,
            false
        );


        // graph 2

        $key = 'tonnSolgtPerSelskapPerAr';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            __('tons_sold_per_company_per_year'),
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false
        );


        // graph 3

        $key = 'resultatIMill';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            __('results_mill'),
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0,
            0,
            false
        );

        // Slide footer start

        $this->MTBModelFooter($currentSlide, 5);
    }

    private function graphSlide2(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // graph 1

        $title = __('production_cost');
        $key = 'prodKost';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0
        );


        // graph 2

        $title = __('average_salmon_price_nok_kg');
        $key = 'lakseprisSnittKrPerKg';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0
        );


        // graph 3

        $title = __('margin_nok_kg_hog');
        $key = 'marginKrPerKgHOG';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0
        );

        // Slide footer start

        $this->MTBModelFooter($currentSlide, 6);
    }


    private function graphSlide3(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // graph 1

        $title = __('efcr');
        $key = 'eFcr';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0
        );


        // graph 2

        $title = __('sgr');
        $key = 'sgr';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false
        );


        // graph 3

        $title = __('days_at_sea');
        $key = 'dagerISjo';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min
        );

        // Slide footer start

        $this->MTBModelFooter($currentSlide, 7);
    }

    private function graphSlide4(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // graph 1

        $title = __('deaths_1000');
        $key = 'dodeAntall';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0,
            0,
            false
        );


        // graph 2

        $title = __('døde_tonn');
        $key = 'dodeTonn';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0,
            0,
            false
        );


        // graph 3

        $title = __('deaths_per_gene_percentage');
        $key = 'dodePerGen';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0,
            0,
            false
        );

        // Slide footer start

        $this->MTBModelFooter($currentSlide, 8);
    }

    private function graphSlide5(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // graph 1

        $title = __('average_harvest_weight_round_hog');
        $key = 'snittvektSloyd';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3FirstGraphOffsetX,
            $this->g3FirstGraphOffsetY,
            $min,
            0
        );


        // graph 2

        $title = __('smolt_weight_in_kg');
        $key = 'smoltVektKg';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3SecondGraphOffsetX,
            $this->g3SecondGraphOffsetY,
            $min,
            0
        );


        // graph 3

        $title = __('smolt_per_cons_per_year_1000');
        $key = 'smoltPerKonsPerAr';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g3ThirdGraphOffsetX,
            $this->g3ThirdGraphOffsetY,
            $min,
            0,
            0,
            false
        );

        // Slide footer start

        $this->MTBModelFooter($currentSlide, 9);
    }


    private function graphSlide6(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];
        $modelCaseText = $this->pptData['modelCaseText'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        $graphFontSize = round(12 / count($this->pptData['caseNumbers'])) + 6;

        // graph 16
        //Nikto Radio
        $nkr1 = $graphResult['nytteKostRatio1'];
        $nkr2 = $graphResult['nytteKostRatio2'];

        unset($nkr1['Case1']);
        unset($nkr2['Case1']);


        $nkData = [
            'nytteKostRatio2' => $nkr2
        ];

        $nkLabels = [];
        foreach ($nkr2 as $case => $value) {
            $case_text = isset($modelCaseText[strtolower($case)]) ? $modelCaseText[strtolower($case)] : $case;
            $nkLabels[] = "'" . $case_text . "'";
        }

        $nkLabelsStr = implode(',', $nkLabels);
        $chart16 = PDFController::drawNikktoGraph($nkLabelsStr, $nkData, null, true, __('benefit_cost_ratio'));
        $chart16 = urlencode($chart16);

        $image_url = 'https://quickchart.io/chart?bkg=white&c=' . $chart16;

        $shape = new Base64();
        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($image_url));

        $shape->setName('nikkto')
            ->setDescription('nikkto graph')
            ->setData($imageData)
            ->setResizeProportional(false)
            ->setHeight($this->graphShapeHeight)
            ->setWidth($this->graphShapeWidth)
            ->setOffsetX($this->g2FirstGraphOffsetX)
            ->setOffsetY($this->g2FirstGraphOffsetY);
        $currentSlide->addShape($shape);


        // Slide footer start

        $this->MTBModelFooter($currentSlide, 10);
    }


    private function graphGrossProfitMargin(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->MTBModelHeader($currentSlide);

        // graph 1

        $title = __('gross_profit_margin_percentage');
        $key = 'grossProfitMargin';
        $data = $this->getMTBData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateMTBBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g2FirstGraphOffsetX,
            $this->g2FirstGraphOffsetY,
            $min,
            0
        );

        $this->MTBModelFooter($currentSlide, 9);
    }


    private function geneticGraphGrossProfitMargin(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->geneticsModelHeader($currentSlide);

        // graph 1

        $title = __('gross_profit_margin_percentage');
        $key = 'grossProfitMargin';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g2FirstGraphOffsetX,
            $this->g2FirstGraphOffsetY,
            $min,
            0
        );

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function optGraphGrossProfitMargin(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->optimizationModelHeader($currentSlide);

        // graph 1

        $title = __('gross_profit_margin_percentage');
        $key = 'grossProfitMargin';
        $data = $this->getOptimizationData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g2FirstGraphOffsetX,
            $this->g2FirstGraphOffsetY,
            $min,
            0
        );

        $this->optimizationModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function vaccineGraphGrossProfitMargin(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->vaccineModelHeader($currentSlide);

        // graph 1

        $title = __('gross_profit_margin_percentage');
        $key = 'grossProfitMargin';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g2FirstGraphOffsetX,
            $this->g2FirstGraphOffsetY,
            $min,
            0
        );

        $this->vaccineModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }

    private function codGraphGPM(&$objPHPPowerPoint)
    {
        $caseNumbers = $this->pptData['caseNumbers'];
        $graphResult = $this->pptData['graphResult'];
        $graphBaseValue = $this->pptData['graphBaseValue'];

        // Create slide
        $currentSlide = $objPHPPowerPoint->createSlide();
        $slideBGColorObj = new Color();
        $slideBGColorObj->setColor(new StyleColor($this->slideBGColor));
        $currentSlide->setBackground($slideBGColorObj);

        // Slider header start
        $this->codModelHeader($currentSlide);

        // graph 1

        $title = __('gross_profit_margin_percentage');
        $key = 'grossProfitMargin';
        $data = $this->getVaccineData($key);
        $min = $this->getMinValue($data, $graphBaseValue[$key]);
        $this->generateBarChart(
            $currentSlide,
            $data,
            $title,
            $this->g2FirstGraphOffsetX,
            $this->g2FirstGraphOffsetY,
            $min,
            0
        );

        $this->codModelFooter($currentSlide, count($objPHPPowerPoint->getAllSlides()));
    }
}
