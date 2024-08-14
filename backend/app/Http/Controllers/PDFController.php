<?php

namespace App\Http\Controllers;

use App\Services\EmailService;
use App\Services\FileService;
use App\Services\ReportService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use PDF;

class PDFController extends Controller
{

    private UserService $userService;
    private EmailService $emailService;
    private ReportService $reportService;
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
        set_time_limit(0);
        $this->userService = $userService;
        $this->emailService = $emailService;
        $this->reportService = $reportService;
        $this->fileService = $fileService;

        //share params for all actions views
        view()->share('alignCallback', $this->getPDFAlignCallback());
        view()->share('colorCallback', $this->getPDFColorCallback());
        view()->share('labelFormatterCallback', $this->getPDFLabelFormatterCallback());

        view()->share('grid_font_size', $this->getGridFontSize());
        view()->share('label_font_size', $this->getLabelFontSize());

        app()->setlocale(request('lang', 'en'));
    }

    private function logoUrl($logo)
    {
        return Storage::url( 'uploads/company_logo/' . $logo);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function downloadMTBPDF(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;
        $pdfData = [
            'pdfUserData' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'date' => date('d/m/Y'),
                'company_logo_url' => $this->logoUrl($currentUserData->company->logo),
            ],
            'caseNumbers' => $request->caseNumbers,
            'modelCaseText' => $request->modelCaseText,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
        ];


        $pdf = PDF::loadView('pdf.mtb', $pdfData);
        $pdf_saved_path = "/tmp";

        if (!file_exists($pdf_saved_path)) {
            mkdir($pdf_saved_path, 0777, true);
        }

        $fileName = 'MTB_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pdf';

        $pdf->save($pdf_saved_path . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('pdf/models', $pdf_saved_path . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'pdf';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);

        // send pdf in email after save
        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pdf_saved_path . '/' . $fileName];
            $emailTemplate = 'email.mtb.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from MTB Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - Your report from MTB Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }

        return $pdf->download('mtb-model');
    }

    public function downloadFeedPDF(Request $request)
    {

        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $pdfData = [
            'pdfUserData' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'date' => date('d/m/Y'),
                'company_logo_url' => $this->logoUrl($currentUserData->company->logo)
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            "vektutviklingValue" => $request->vektutvikling,
            "feedTimeline" => $request->feedTimeline,
            "feedProducer" => $request->feedProducer,
            "slaktevekt" => $request->slaktevekt,
            "alignCallback" => $this->getPDFAlignCallback(),
            "colorCallback" => $this->getPDFColorCallback(),
            "graphBarColors" => $request->graphBarColors
        ];


        $pdf = PDF::loadView('pdf.feed', $pdfData);
        $pdf_saved_path = "/tmp";
        if (!file_exists($pdf_saved_path)) {
            mkdir($pdf_saved_path, 0777, true);
        }
        $fileName = 'FEED_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pdf';
        $pdf->save($pdf_saved_path . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('pdf/models', $pdf_saved_path . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'pdf';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);


        // send pdf in email after save
        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pdf_saved_path . '/' . $fileName];
            $emailTemplate = 'email.feed.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report from Feed C/B Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }

            if ($request->sendToMe === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Feed C/B Model';
                $email_data = array(
                    'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }


        return $pdf->download('feed-model');
    }

    public function downloadVaccinePDF(Request $request)
    {


        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $pdfData = [
            'pdfUserData' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'date' => date('d/m/Y'),
                'company_logo_url' => $this->logoUrl($currentUserData->company->logo)
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            "inputs" => $request->inputs,
            "alignCallback" => $this->getPDFAlignCallback(),
            "colorCallback" => $this->getPDFColorCallback()
        ];

        $pdf = PDF::loadView('pdf.vaccine', $pdfData);
        $pdf_saved_path = "/tmp";
        if (!file_exists($pdf_saved_path)) {
            mkdir($pdf_saved_path, 0777, true);
        }
        $fileName = 'Vaccine_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pdf';
        $pdf->save($pdf_saved_path . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('pdf/models', $pdf_saved_path . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'pdf';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);


        // send pdf in email after save
        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pdf_saved_path . '/' . $fileName];
            $emailTemplate = 'email.vaccine.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Vaccine Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
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
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }


        return $pdf->download('vaccine-model');
    }


    public function downloadOptimizationPDF(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $pdfData = [
            'pdfUserData' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'date' => date('d/m/Y'),
                'company_logo_url' => $this->logoUrl($currentUserData->company->logo)
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            "inputs" => $request->inputs,
            "alignCallback" => $this->getPDFAlignCallback(),
            "colorCallback" => $this->getPDFColorCallback()
        ];


        $pdf = PDF::loadView('pdf.optimization', $pdfData);
        $pdf_saved_path = "/tmp";
        if (!file_exists($pdf_saved_path)) {
            mkdir($pdf_saved_path, 0777, true);
        }
        $fileName = 'Optimization_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pdf';
        $pdf->save($pdf_saved_path . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('pdf/models', $pdf_saved_path . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'pdf';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);


        // send pdf in email after save
        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pdf_saved_path . '/' . $fileName];
            $emailTemplate = 'email.optimization.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Optimization Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
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
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }


        return $pdf->download('optimization-model');
    }

    public function downloadGeneticsPDF(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $pdfData = [
            'pdfUserData' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'date' => date('d/m/Y'),
                'company_logo_url' => $this->logoUrl($currentUserData->company->logo)
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            "inputs" => $request->inputs,
            "alignCallback" => $this->getPDFAlignCallback(),
            "colorCallback" => $this->getPDFColorCallback()
        ];


        $pdf = PDF::loadView('pdf.genetics', $pdfData);
        $pdf_saved_path = "/tmp";
        if (!file_exists($pdf_saved_path)) {
            mkdir($pdf_saved_path, 0777, true);
        }
        $fileName = 'Genetics_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pdf';
        $pdf->save($pdf_saved_path . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('pdf/models', $pdf_saved_path . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'pdf';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);


        // send pdf in email after save
        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pdf_saved_path . '/' . $fileName];
            $emailTemplate = 'email.genetics.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Genetics Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
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
                    'type' => 'pdf',
                    'email_to' => 'me'

                );
                try {
                    $this->emailService->at2SendEmail(
                        $email_data['name'],
                        $currentUserData->email,
                        $emailSubject,
                        $email_data,
                        $emailTemplate,
                        $files
                    );
                    $response = ['email' => 'Email sent'];
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }


        return $pdf->download('genetics-model');
    }



    public function downloadCodPDF(Request $request)
    {
        $currentUserData = $this->userService->getCurrentUser();
        $user_id = $currentUserData->id;
        $company_id = $currentUserData->company->id;

        $pdfData = [
            'pdfUserData' => [
                'name' => $currentUserData->first_name . ' ' . $currentUserData->last_name,
                'company' => $currentUserData->company->name,
                'date' => date('d/m/Y'),
                'company_logo_url' => $this->logoUrl($currentUserData->company->logo)
            ],
            'caseNumbers' => $request->caseNumbers,
            'tableViewResult' => $request->tableViewResult,
            'graphResult' => $request->graphResult,
            'graphBaseValue' => $request->graphBaseValue,
            "inputs" => $request->inputs,
            "alignCallback" => $this->getPDFAlignCallback(),
            "colorCallback" => $this->getPDFColorCallback()
        ];

        $pdf = PDF::loadView('pdf.cod', $pdfData);
        $pdf_saved_path = "/tmp";
        if (!file_exists($pdf_saved_path)) {
            mkdir($pdf_saved_path, 0777, true);
        }
        $fileName = 'Cod_' . $user_id . '_' . $company_id . '_' . date('dmYHis') . '.' . 'pdf';

        $pdf->save($pdf_saved_path . '/' . $fileName);

        // Copy tmp file to Storage
        $this->fileService->copyAs('pdf/models', $pdf_saved_path . '/' . $fileName, $fileName);

        // save report data
        $reportData['file_name'] = $fileName;
        $reportData['file_type'] = 'pdf';
        $reportData['tool_id'] = $request->toolID;
        $reportData['user_id'] = $user_id;
        $reportData['company_id'] = $company_id;
        $this->reportService->save($reportData);


        // send pdf in email after save
        if ($request->sendToEmail === true || $request->sendToMe === true) {
            $files = [$pdf_saved_path . '/' . $fileName];
            $emailTemplate = 'email.cod.report';
            if ($request->sendToEmail === true) {
                $emailSubject = 'AquaTools v2.0 - A report sent from Cost of Disease Model';
                $email_data = array(
                    'name' => $this->emailService->extractNameFromEmail($request->pdfEmail),
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
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
                    'type' => 'pdf',
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
                    return response()->json($response, 200);
                } catch (\Exception $e) {
                    $response = ['email' => 'Failed', 'message' => $e->getMessage()];
                    print_r(json_encode($response));
                    exit;
                }
            }
        }


        return $pdf->download('vaccine-model');
    }

    public function pdfView(Request $request)
    {
        return View('pdf.mtb');
    }


    public function emailTest()
    {
        try {
            $email_data = array('name' => 'User');

            $to_name = 'Test';

            $to_email = '';

            $email_subject = 'Test Email';

            $files = [public_path() . "/pdf/mtb/MTB_1_1_12102020164509.pdf"];

            Mail::send(
                'email.mtb.report',
                $email_data,
                function ($message) use ($to_name, $to_email, $email_subject, $files) {
                    $message->to($to_email, $to_name)
                        ->subject($email_subject);

                    // if have attachments
                    if (count($files) > 0) {
                        foreach ($files as $file) {
                            $message->attach($file);
                        }
                    }

                    $message->from('noreply@spillfree.no', 'SpillFree');
                }
            );
            print_r('email sent');
            exit;
        } catch (\Exception $e) {
            print_r($e->getMessage());
            exit;
        }
    }


    // PDF generation helper functions
    private static function getGridFontSize()
    {
        return '15';
    }
    private static function getLabelFontSize()
    {
        return '20';
    }
    public static function getPDFAlignCallback()
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

    public static function getPDFColorCallback()
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


    public static function getPDFBeforeFitCallback()
    {

        $callback = "function(scale) {

            var ticks = scale.ticksAsNumbers;
            var min = Math.min.apply(null, ticks.map(Math.abs));
            var max = Math.max.apply(null, ticks.map(Math.abs));
            var stepSize = Math.abs(ticks[0])- Math.abs(ticks[1]);

            // var data = [];

            // scale.chart.config.data.datasets.forEach(function(dataset){
            //     data = data.concat(dataset.data);
            // });

            var maxValue = 790000;//Math.max.apply(null, data.map(Math.abs));

            if(maxValue + stepSize > max)
                scale.max = scale.max + stepSize;

            //scale.max = maxValue + stepSize > max ? scale.max + stepSize : scale.max;

        }";

        return $callback;
    }

    public static function getMTBPDFLabelFormatterCallback($percentange = false)
    {
        $p = !$percentange ? '' : ' %';

        $callback = "function(value) {
            var formatedValue = value;
            return formatedValue + '" . $p . "';
        }";

        return $callback;
    }


    public static function getPDFLabelFormatterCallback($percentange = false, $decimal = 2)
    {
        $p = !$percentange ? '' : ' %';

        $callback = "function(value) {
            //var value = parseFloat(value).toFixed(" . $decimal . ");
            //let res = value.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');
            var formatedValue = parseFloat(value).toFixed(" . $decimal . ").replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');
            return formatedValue + '" . $p . "';
        }";

        return $callback;
    }

    public static function getBarColorFromRequest()
    {
        $colors = [];

        //for feed model, get color dynamically from request
        if (request('graphBarColors') and (count(request('graphBarColors')) == count(request('caseNumbers')))) {
            $colors = array_map(function ($color) {
                list($r, $g, $b) = sscanf($color, "#%02x%02x%02x");
                $rgb =  "$r,$g,$b,1";
                return '"rgba(' . $rgb . ')"';
            }, request('graphBarColors'));
        }

        return $colors;
    }


    public static function getCaseColors()
    {
        return ['21,115,195,1', '0,167,237,1', '0, 195, 106, 1', '34, 235, 160, 1', '27, 160, 195,1'];
    }

    public static function drawNikktoGraph($labels, $data, $nkrColors = null, $showTitle = 0, $title = "Benefit/ Cost ratio", $titleFontSize = 20)
    {

        $grid_font_size = self::getGridFontSize();
        $label_font_size = self::getLabelFontSize();
        $alignCallback = self::getPDFAlignCallback();
        $colorCallback = self::getPDFColorCallback();
        $labelFormatterCallback = self::getPDFLabelFormatterCallback(false, 1);

        // get color from second cases if not provided
        if (is_null($nkrColors)) {
            $allColors = self::getCaseColors();
            $nkrColors = array_slice($allColors, 1);
        }

        $nikktoColorString = array_map(function ($color) {
            return '"rgba(' . $color . ')"';
        }, $nkrColors);

        //for feed model, get color dynamically from request
        if (request('graphBarColors') and (count(request('graphBarColors')) == count(request('caseNumbers')))) {
            $nikktoColorString = self::getBarColorFromRequest();
            unset($nikktoColorString[0]);
        }

        $nikktoColorString = implode(',', $nikktoColorString);

        $nkrDatasetStr = '';

        foreach ($data as $key => $value) {
            $nkrDatasetStr .= "{
                label: '" . $key . "',
                backgroundColor: [" . $nikktoColorString . "],
                data: [" . implode(',', $value) . "],
                barThickness: 60,
                borderColor:'white',
                borderWidth: 1,
                xAxisID:'xAxis1'
            },";
        }

        $nkrDatasetStr = rtrim($nkrDatasetStr, ',');

        $config = "{
            type: 'bar',
            data: {
                    labels: [" . $labels . "],
                    datasets: [" . $nkrDatasetStr . "],
            },
            options: {
                title: {
                    display: " . $showTitle . ",
                    text: '" . $title . "',
                    fontSize:" . $titleFontSize . "
                },
                scales: {
                    xAxes: [{
                        id: 'xAxis1',
                        ticks: {
                            fontSize: 12,
                            callback:function(label) {
                             return 'BCR';
                           }
                        },
                        offset: true,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    },
                    {
                        id:'xAxis2',
                        ticks: {
                            fontSize: " . $grid_font_size . ",
                        },
                        offset: true,
                        gridLines: {
                            drawOnChartArea: false
                        },
                    }
                ],
                    yAxes: [{
                        ticks: {
                            fontSize: " . $grid_font_size . ",
                            maxTicksLimit: 8,
                            beginAtZero: true
                        },
                        offset: false,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }]
                },
                legend: {
                    display: false
                },
                plugins: {
        datalabels: {
            formatter: " . $labelFormatterCallback . ",
            anchor: 'center',
            align: " . $alignCallback . ",
            clamp: true,
            font: {
            weight: 'bold',
            size: " . $label_font_size . ",
            },
            color: " . $colorCallback . ",

        }
        }
            }
        }";

        return $config;
    }

    public static function drawMTBBarChart($x_labels, $data, $baseValue, $grid_font_size = null, $label_font_size = null, $alignCallback = null, $colorCallback = null, $labelFormatterCallback = null, $percentange = false, $decimal = 2, $bgColors = null)
    {
        if (is_null($alignCallback))
            $alignCallback = self::getPDFAlignCallback();

        if (is_null($colorCallback))
            $colorCallback = self::getPDFColorCallback();

        // Skip decimal formatter for MTB model
        if (is_null($labelFormatterCallback))
            $labelFormatterCallback = self::getMTBPDFLabelFormatterCallback($percentange);

        if (is_null($grid_font_size))
            $grid_font_size = self::getGridFontSize();

        if (is_null($label_font_size))
            $label_font_size = self::getLabelFontSize();

        $baseValue = $baseValue ?: 0;

        //graph color
        if (is_null($bgColors)) {
            $bgColors = array_map(function ($color) {
                return '"rgba(' . $color . ')"';
            }, self::getCaseColors());
        }

        //for feed model, get color dynamically from request
        if (request('graphBarColors') and (count(request('graphBarColors')) == count(request('caseNumbers')))) {
            $bgColors = self::getBarColorFromRequest();
        }

        $colorsString = implode(',', $bgColors);



        $config = "{
            type: 'bar',
            data: {
                    labels: [" . rtrim($x_labels, ',') . "],
                    datasets: [{
                            barThickness: 90,
                            backgroundColor: [" . $colorsString . "],
                            data: [" . rtrim($data, ',') . "],
                        }],
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: " . $grid_font_size . ",
                        },
                        offset: true,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontSize: " . $grid_font_size . ",
                            suggestedMin: " . $baseValue . "
                        },
                        offset: false,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }]
                },
                legend: {
                    display: false
                },
                plugins: {
        datalabels: {
            formatter: " . $labelFormatterCallback . ",
            anchor: 'center',
            align: " . $alignCallback . ",
            clamp: true,
            font: {
            weight: 'bold',
            size: " . $label_font_size . ",
            },
            color: " . $colorCallback . ",
         }
        }
            }
        }";


        return $config;
    }

    public static function drawBarChart($x_labels, $data, $baseValue, $grid_font_size = null, $label_font_size = null, $alignCallback = null, $colorCallback = null, $labelFormatterCallback = null, $percentange = false, $decimal = 2, $bgColors = null)
    {
        if (is_null($alignCallback))
            $alignCallback = self::getPDFAlignCallback();

        if (is_null($colorCallback))
            $colorCallback = self::getPDFColorCallback();

        // Skip formatter callback for MTB model
        if (is_null($labelFormatterCallback))
            $labelFormatterCallback = self::getPDFLabelFormatterCallback($percentange, $decimal);

        if (is_null($grid_font_size))
            $grid_font_size = self::getGridFontSize();

        if (is_null($label_font_size))
            $label_font_size = self::getLabelFontSize();

        $baseValue = $baseValue ?: 0;

        //graph color
        if (is_null($bgColors)) {
            $bgColors = array_map(function ($color) {
                return '"rgba(' . $color . ')"';
            }, self::getCaseColors());
        }

        //for feed model, get color dynamically from request
        if (request('graphBarColors') and (count(request('graphBarColors')) == count(request('caseNumbers')))) {
            $bgColors = self::getBarColorFromRequest();
        }

        $colorsString = implode(',', $bgColors);



        $config = "{
            type: 'bar',
            data: {
                    labels: [" . rtrim($x_labels, ',') . "],
                    datasets: [{
                            barThickness: 90,
                            backgroundColor: [" . $colorsString . "],
                            data: [" . rtrim($data, ',') . "],
                        }],
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: " . $grid_font_size . ",
                        },
                        offset: true,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontSize: " . $grid_font_size . ",
                            suggestedMin: " . $baseValue . "
                        },
                        offset: false,
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }]
                },
                legend: {
                    display: false
                },
                plugins: {
        datalabels: {
            formatter: " . $labelFormatterCallback . ",
            anchor: 'center',
            align: " . $alignCallback . ",
            clamp: true,
            font: {
            weight: 'bold',
            size: " . $label_font_size . ",
            },
            color: " . $colorCallback . ",
         }
        }
            }
        }";


        return $config;
    }

    public static function feedSukdomGraph($showTitle = 1)
    {


        $grid_font_size = self::getGridFontSize();
        $label_font_size = self::getLabelFontSize();


        //Sukdom graph
        $vektutviklingValue = request('vektutvikling');

        $tmpArray = [];
        foreach ($vektutviklingValue as $case => $array) {
            $tmpArray[$case] = count($array);
        }
        //get key of case of maximum no of dates
        $maxCase = array_search(max($tmpArray), $tmpArray);

        $maxCaseArray = $vektutviklingValue[$maxCase];

        //get x-axis and tenperature data from case 1
        $labels = implode(',', array_map(function ($item) {
            return '"' . $item . '"';
        }, array_keys($maxCaseArray)));

        $tempData = implode(',', array_column($vektutviklingValue[$maxCase], 'temp'));

        // get vekt data from all casese
        $caseDataArray = [];
        $colorsScheme = PDFController::getBarColorFromRequest();
        $i = 0;
        foreach ($vektutviklingValue as $case => $caseArray) {

            $vektData = implode(',', array_column($caseArray, 'vekt'));

            // generate rgb color
            $color = $colorsScheme[$i];
            $i++;

            $caseDataArray[] = '{
                "label": "' . __(strtolower($case)) . '",
                "borderColor": ' . $color . ',
                "backgroundColor": ' . $color . ',
                "fill": false,
                "data": [' . $vektData . '],
                "yAxisID": "y"
            }';
        }
        $caseData = implode(',', $caseDataArray);

        // build graph parameter string
        $config = '{
                "type": "line",
                "data": {
                "labels": [
                ' . $labels . '
                ],
                "datasets": [

                ' . $caseData . '
                ,
                {
                    "label": "'.__('temperature').'",
                    "borderColor": "rgb(235, 125, 53)",
                    "backgroundColor": "rgb(235, 125, 53)",
                    "fill": false,
                    "data": [
                    ' . $tempData . '
                    ],
                    "yAxisID": "y1"
                }
                ]
                },
                "options": {
                "legend": {
                    "display": true,
                    "position": "bottom",
                    "align": "center"
                    },
                "stacked": false,
                "title": {
                    "display": ' . $showTitle . ',
                    "text": "' . __('weight_development') . '"
                    },
                "scales": {
                "yAxes": [
                        {
                            "id": "y",
                            ticks: {
                                stepSize: 2000,
                                fontSize: ' . $grid_font_size . '

                            },
                            "type": "linear",
                            "display": true,
                            "position": "left",
                            "scaleLabel": {
                                "display": true,
                                "labelString": "'.__('average_weight').' (g)",
                            }
                        },
                        {
                            "id": "y1",
                            ticks: {
                                stepSize: 6,
                                fontSize: ' . $grid_font_size . '
                            },
                            "type": "linear",
                            "display": true,
                            "scaleLabel": {
                                "display": true,
                                "labelString": "'.__('temperature').'",
                            },
                            "position": "right",
                            "gridLines": {
                                "drawOnChartArea": false
                            }
                        }
                    ]
                }
                }
            }';

        //logger($config);
        return $config;
    }

    public static function renderImage($config)
    {
        $url = "https://quickchart.io/chart?c=" . $config;

        $imageData = "data:image/jpeg;base64," . base64_encode(file_get_contents($url));

        return '<img src="' . $imageData . '"/>';
    }

    public static function mtbGraphValue($data, $key, $case)
    {
        $value = (float) $data[$key]['Case' . $case];
        if( strlen(explode('.', $value)[0]) >= 4 ) {
            $value = (int) round($value);
        }

        if (strlen(explode('.', $value)[0]) == 3 && strlen(explode('.', $value)[1]) >= 1) {
            $value = round($value, 1);
        }

        return $value;
    }
}
