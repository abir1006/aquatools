<?php

use App\Events\SSOLogout;
use App\Models\Company;
use App\Models\Role_User;
use App\Models\User;
use Facade\FlareClient\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Kodeine\Acl\Models\Eloquent\Role;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/tool/upload', 'ToolController@upload');

Route::post('login', 'AuthController@login');

//forgot password and reset routes

Route::post('/user/reset_password/forgot', 'UserController@forgot');
Route::post('/user/reset_password/forgot_resend', 'UserController@forgotResend');
Route::post('/user/reset_password/verify_code', 'UserController@resetVerifyCode');
Route::post('/user/reset_password/change', 'UserController@changeResetPassword');


//Route::get('/model/download-ppt', 'PPTController@downloadMTBPPT');

// Test routes

Route::get('/email/template', 'EmailController@testTemplate');
Route::get('/email/template/send', 'EmailController@emailTest');

Route::post('/feedModel/testAllClasses', 'FeedModelController@testAllClasses');

Route::get('/translations/fetch/{lang}', 'TranslationController@fetch')->name('translations.fetch');
Route::get('/test', function () {
    return auth()->user();
})->middleware('auth0.jwt');

//for auth0
Route::get('user/check/{email}', function ($email) {

    $user = User::whereHas(
        'company',
        function ($query) {
            $query->where('status', 1);
        }
    )->where('status', 1)->where('email', $email)->first();
    if ($user)
        return response()->json([
            'message' => "User Found",
            'data' => $user->toArray()
        ], 200);
    else
        return response()->json([
            'message' => "User not found",
            'redirect_url' => env('MIX_TOOLBOX_DASHBOARD_URL')

        ], 404);
});


Route::get('user/all', 'UserController@all');


Route::get('user/all', 'UserController@all');


Route::group(
    ['middleware' => 'auth0.jwt'],
    function () {

        // template import export
        Route::get('/template/export/{id}', 'TemplateController@export');
        Route::post('/template/import', 'TemplateController@import');

        Route::post('user/logout', 'UserController@logout');
        Route::post('dashboard/statistics', 'DashboardController@statistics');

        Route::post('user/details', 'UserController@details');
        Route::post('user/listAll', 'UserController@listAll');
        Route::post('user/activity/latest', 'UserActivityController@latest');
        Route::delete('user/activity/delete', 'UserActivityController@destroy');
        Route::post('user/notifications/latest', 'NotificationController@latest');
        Route::delete('user/notification/delete', 'NotificationController@destroy');
        Route::post('/invoice_setting/currency_dropdown', 'InvoiceSettingController@currencyDropdown');
        Route::post(
            '/invoice_setting/subscription_duration_dropdown',
            'InvoiceSettingController@subscriptionDurationDropdown'
        );
        Route::post('/company/list_all', 'CompanyController@listAll');
        Route::post('/company/list_by_tool_access', 'CompanyController@listByToolAccess');
        Route::post('/role/list_all', 'RoleController@listAll');
        Route::post('/tool/list', 'ToolController@list');
        Route::get('/tool/single/{slug}', 'ToolController@getSingle');
        Route::post('/addon/list', 'AddonController@list');
        Route::post('company/upload_logo', 'FileUploadController@companyLogo');
        Route::post('/company/list_details', 'CompanyController@listDetails');

        //PDF
        Route::post('/model/download-pdf', 'PDFController@downloadMTBPDF');
        Route::post('/feedModel/download-pdf', 'PDFController@downloadFeedPDF');
        Route::post('/vaccine/download-pdf', 'PDFController@downloadVaccinePDF');
        Route::post('/optimalisering/download-pdf', 'PDFController@downloadOptimizationPDF');
        Route::post('/cod/download-pdf', 'PDFController@downloadCodPDF');
        Route::post('/genetics/download-pdf', 'PDFController@downloadGeneticsPDF');

        //PPT
        Route::post('/feedModel/download-ppt', 'PPTController@downloadFeedPPT');
        Route::post('/model/download-ppt', 'PPTController@downloadMTBPPT');
        Route::post('/vaccine/download-ppt', 'PPTController@downloadVaccinePPT');
        Route::post('/optimalisering/download-ppt', 'PPTController@downloadOptimizationPPT');
        Route::post('/cod/download-ppt', 'PPTController@downloadCodPPT');
        Route::post('/genetics/download-ppt', 'PPTController@downloadGeneticsPPT');

        Route::post('/template/{id}/rename', 'TemplateController@rename')->name('template.rename');
        Route::post('/template/save', 'TemplateController@store');
        Route::put('template/update', 'TemplateController@update');
        Route::post('/template/user_list', 'TemplateController@userList');
        Route::post('/template/user_list_search', 'TemplateController@userListSearch');
        Route::post('/template/share', 'TemplateController@share');
        Route::delete('/template/remove_share', 'TemplateController@removeShare');
        Route::post('/template/list_dropdown', 'TemplateController@listDropdown');

        // Template notes related routes

        Route::get('template_notes/list', 'TemplateNotesController@list');
        Route::post('template_notes/save', 'TemplateNotesController@store');
        Route::put('template_notes/update', 'TemplateNotesController@update');

        Route::post('report/list', 'ReportController@list');
        Route::post('report/search', 'ReportController@search');
        Route::post('download/file', 'ReportController@download');
        Route::delete('report/delete', 'ReportController@destroy');

        // MTB Calculation
        Route::post('/mtb/excel_calculation', 'MTBController@excelCalculation');
        Route::post('/mtb/price_module_excel_calculation', 'MTBController@priceModuleExcelCalculation');
        Route::post('/mtb/price_module_excel_calculation_test', 'MTBController@priceModuleExcelCalculationTest');

        //Temperature
        Route::post('/temperature/token', 'TemperatureController@token');
        Route::get('/temperature/{id}', 'TemperatureController@findOne');
        Route::post('/temperature/fetch', 'TemperatureController@fetch');
        Route::post('/temperature/template/save', 'TemperatureController@store');
        Route::post('/temperature/template/list', 'TemperatureController@list');
        Route::put('/temperature/template/{id}', 'TemperatureController@update');
        Route::delete('/temperature/template/{id}', 'TemperatureController@destroy');


        Route::get('/user/profile', 'UserController@userProfileInfoView');
        Route::put('/user/profile/update', 'UserController@userProfileInfoUpdate');
        Route::put('/user/password/update', 'UserController@userPasswordUpdate');
        Route::post('/user/profile-picture/update/', 'UserController@userProfilePicUpdate');


        // feed library API start
        Route::post('/feed/list', 'FeedController@list');
        Route::post('/feed/save', 'FeedController@store');
        Route::put('/feed/update', 'FeedController@update');
        Route::delete('/feed/delete', 'FeedController@destroy');
        Route::post('/company/feedCustomFields', 'CompanyController@feedCustomFields');

        Route::post('/feed_settings/fieldList', 'FeedSettingsController@fieldsList');

        Route::post('/translations/import', 'TranslationController@import')->name('translations.import');;
        Route::get('/translations/export', 'TranslationController@export')->name('translations.export');;
        Route::get('/translations/languages', 'TranslationController@languages')->name('translations.languages');
        Route::resource('translations', 'TranslationController', ['only' => ['index', 'store', 'update', 'destroy']]);

        //material categories, tags
        Route::resource('tags', 'TagsController', ['only' => ['index', 'store', 'update', 'destroy']]);
        Route::resource(
            'categories',
            'MaterialCategoryController',
            ['only' => ['index', 'store', 'update', 'destroy']]
        );

        // site settings
        Route::get('/site-settings/list', 'SiteSettingsController@index');
        Route::post('/site-settings/translation', 'SiteSettingsController@saveTranslationSettings');

        //materials
        Route::post('/materials/notification/read/{id}', 'MaterialController@markasRead');
        Route::get('/material/notifications', 'MaterialController@getUnreadNofication');
        Route::get('/material/list', 'MaterialController@list');
        Route::get('/material/listAll', 'MaterialController@listAll');
        Route::post('/material/save', 'MaterialController@store');
        Route::post('/material/saveOrder', 'MaterialController@saveOrder');
        Route::post('/material/update', 'MaterialController@update');
        Route::delete('/material/delete', 'MaterialController@destroy');
        Route::delete('/materialResource/delete', 'MaterialController@deleteMaterialResources');
        Route::post('material/search', 'MaterialController@search');
        Route::get('material/categories', 'MaterialController@categories');
        Route::get('/material/{id}', 'MaterialController@singleMaterial');

        // Feed Model Calculation
        Route::post('/feedModel/calculation', 'FeedModelController@calculation');

        // Vaccination module
        Route::post('/vaccine/calculation', 'VaccineModelController@calculation');

        // Optimization module
        Route::post('/optimalisering/calculation', 'OptimaliseringModelController@calculation');

        // COD module
        Route::post('/cod/calculation', 'CodModelController@calculation');

        // Genetics model
        Route::post('/genetics/calculation', 'GeneticsModelController@calculation');

        Route::post('/user/update_cookie_consent', 'UserController@updateCookieConsent');
    }
);
Route::group(
    ['middleware' => 'toolbox.jwt'],
    function () {

        Route::post('/sso-logout', function () {

            $email = request('email');
            event(new SSOLogout($email));
            return ['message' => 'done'];
        });

        Route::delete(
            '/user/{email}/delete',
            [
                'uses' => 'UserController@destroyUserByEmail',
                'can' => 'delete.users.byemail'
            ]
        );

        Route::delete('/company/{name}/delete', 'CompanyController@destroyCompanyByName');

        Route::post('/user/create_from_toolbox', function () {
            $data = request()->all();
            $company = Company::where('name', $data['company_name'])->first();
            $role = Role::where('slug', $data['role_slug'])->first();

            if ($company && $role) {

                $data['password'] = bcrypt($data['password']);
                $data['company_id'] = $company->id;
                $data['role_id'] = $role->id;
                $user = User::create($data);
                $data['user_id'] = $user->id;
                Role_User::create($data);

                return response()->json([
                    'status' => 'success',
                    'message' => 'User created successfully',
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Company or Role not found',
                ], 404);
            }
        });

        Route::put('/user/update_from_toolbox', 'UserController@updateProfileInfoFromToolbox');
        Route::put('/user/update_from_toolbox/avatar', 'UserController@updateProfileAvatarFromToolbox');
        // company create from ToolBox
        Route::post('/company/create', 'CompanyController@create');

        // company update from ToolBox
        Route::put('/company/update_from_toolbox', 'CompanyController@updateFromToolbox');

        // Excel upload
        Route::post('price/excel/upload', 'FileUploadController@priceExcel');

        // Excel upload
        Route::get('price/excel/list', 'FileUploadController@getPriceExcels');

    }
);


Route::group(
    ['middleware' => ['auth0.jwt', 'acl']],
    function () {
        //....... role start............
        Route::post(
            '/role/list',
            [
                'uses' => 'RoleController@list',
                'can' => 'list.roles'
            ]
        );
        Route::post(
            '/role/save',
            [
                'uses' => 'RoleController@store',
                'can' => 'save.roles'
            ]
        );
        Route::post(
            '/role/update',
            [
                'uses' => 'RoleController@update',
                'can' => 'update.roles'
            ]
        );
        Route::post(
            '/role/delete',
            [
                'uses' => 'RoleController@destroy',
                'can' => 'delete.roles'
            ]
        );
        //....... role end............

        //....... permission start............
        Route::post(
            '/permission/list',
            [
                'uses' => 'PermissionController@list',
                'can' => 'list.permissions'
            ]
        );
        Route::post(
            '/permission/save',
            [
                'uses' => 'PermissionController@store',
                'can' => 'save.permissions'
            ]
        );
        Route::post(
            '/permission/update',
            [
                'uses' => 'PermissionController@update',
                'can' => 'update.permissions'
            ]
        );
        Route::post(
            '/permission/delete',
            [
                'uses' => 'PermissionController@destroy',
                'can' => 'delete.permissions'
            ]
        );
        Route::post(
            '/permission/features',
            [
                'uses' => 'PermissionController@features',
                'can' => 'features.permissions'
            ]
        );
        Route::post(
            '/permission/actions',
            [
                'uses' => 'PermissionController@actions',
                'can' => 'actions.permissions'
            ]
        );

        Route::post(
            '/permission/role_wise_update',
            [
                'uses' => 'PermissionController@roleWiseUpdate',
                'can' => 'update.permissions'
            ]
        );
        //....... permission end............


        //....... user start............
        Route::post(
            '/user/list',
            [
                'uses' => 'UserController@list',
                'can' => 'list.users'
            ]
        );
        Route::post(
            '/user/listSort',
            [
                'uses' => 'UserController@listSort',
                'can' => 'list.users'
            ]
        );
        Route::post(
            '/user/search',
            [
                'uses' => 'UserController@search',
                'can' => 'search.users'
            ]
        );
        Route::post(
            '/user/save',
            [
                'uses' => 'UserController@store',
                'can' => 'save.users'
            ]
        );
        Route::post(
            '/user/update',
            [
                'uses' => 'UserController@update',
                'can' => 'update.users'
            ]
        );
        Route::post(
            '/user/delete',
            [
                'uses' => 'UserController@destroy',
                'can' => 'delete.users'
            ]
        );


        Route::post(
            '/user/change_status',
            [
                'uses' => 'UserController@changeStatus',
                'can' => 'block.users'
            ]
        );
        Route::post(
            '/user/change_password',
            [
                'uses' => 'UserController@changePassword',
                'can' => 'change-password.users'
            ]
        );
        //....... user end............

        //....... invoice settings start............
        Route::post(
            '/invoice_setting/list',
            [
                'uses' => 'InvoiceSettingController@list',
                'can' => 'list.invoice_settings'
            ]
        );
        Route::post(
            '/invoice_setting/save',
            [
                'uses' => 'InvoiceSettingController@store',
                'can' => 'save.invoice_settings'
            ]
        );
        Route::put(
            '/invoice_setting/update',
            [
                'uses' => 'InvoiceSettingController@update',
                'can' => 'update.invoice_settings'
            ]
        );
        Route::post(
            '/invoice_setting/search',
            [
                'uses' => 'InvoiceSettingController@search',
                'can' => 'search.invoice_settings'
            ]
        );
        Route::delete(
            '/invoice_setting/delete',
            [
                'uses' => 'InvoiceSettingController@destroy',
                'can' => 'delete.invoice_settings'
            ]
        );
        //....... invoice settings end............

        //....... company start............
        Route::post(
            '/company/list',
            [
                'uses' => 'CompanyController@list',
                'can' => 'list.companies'
            ]
        );
        Route::post(
            '/company/search',
            [
                'uses' => 'CompanyController@search',
                'can' => 'search.companies'
            ]
        );
        Route::post(
            '/company/save',
            [
                'uses' => 'CompanyController@store',
                'can' => 'save.companies'
            ]
        );
        Route::put(
            '/company/update',
            [
                'uses' => 'CompanyController@update',
                'can' => 'update.companies'
            ]
        );
        Route::delete(
            '/company/delete',
            [
                'uses' => 'CompanyController@destroy',
                'can' => 'delete.companies'
            ]
        );
        Route::post(
            '/company/change_status',
            [
                'uses' => 'CompanyController@changeStatus',
                'can' => 'block.companies'
            ]
        );

        Route::post(
            '/company_tool/change_status',
            [
                'uses' => 'CompanyToolController@changeStatus',
                'can' => 'block.models'
            ]
        );
        Route::post(
            '/company_addon/change_status',
            [
                'uses' => 'CompanyAddonController@changeStatus',
                'can' => 'block.addons'
            ]
        );

        Route::post(
            '/company/edit',
            [
                'uses' => 'CompanyController@edit',
                'can' => 'update.companies'
            ]
        );

        //....... company end............

        //....... invoice start............
        Route::post(
            '/invoice/send',
            [
                'uses' => 'InvoiceController@send',
                'can' => 'update.companies'
            ]
        );
        //....... invoice end............

        //....... tool start............
        Route::post(
            '/tool/save',
            [
                'uses' => 'ToolController@store',
                'can' => 'save.models'
            ]
        );
        Route::delete(
            '/tool/delete',
            [
                'uses' => 'ToolController@destroy',
                'can' => 'delete.models'
            ]
        );
        Route::put(
            '/tool/update',
            [
                'uses' => 'ToolController@update',
                'can' => 'update.models'
            ]
        );
        //....... tool end............

        //....... block start............
        Route::post(
            '/block/list',
            [
                'uses' => 'BlockController@list',
                'can' => 'list.model_blocks'
            ]
        );
        Route::post(
            '/block/save',
            [
                'uses' => 'BlockController@store',
                'can' => 'save.model_blocks'
            ]
        );
        Route::delete(
            '/block/delete',
            [
                'uses' => 'BlockController@destroy',
                'can' => 'delete.model_blocks'
            ]
        );
        Route::put(
            '/block/update',
            [
                'uses' => 'BlockController@update',
                'can' => 'update.model_blocks'
            ]
        );

        //....... block end............

        //....... block input start............
        Route::post(
            '/block_input/list',
            [
                'uses' => 'BlockInputController@list',
                'can' => 'list.model_blocks'
            ]
        );
        Route::post(
            '/block_input/save',
            [
                'uses' => 'BlockInputController@store',
                'can' => 'save.model_blocks'
            ]
        );
        Route::delete(
            '/block_input/delete',
            [
                'uses' => 'BlockInputController@destroy',
                'can' => 'delete.model_blocks'
            ]
        );
        Route::put(
            '/block_input/update',
            [
                'uses' => 'BlockInputController@update',
                'can' => 'update.model_blocks'
            ]
        );
        Route::put(
            '/block_input/order/drag_n_drop',
            [
                'uses' => 'BlockInputController@dragAndDrop',
                'can' => 'update.model_blocks'
            ]
        );
        //....... block input end............


        //....... module input start............
        Route::post(
            '/module/list',
            [
                'uses' => 'ModuleController@list',
                'can' => 'list.model_blocks'
            ]
        );
        Route::post(
            '/module/save',
            [
                'uses' => 'ModuleController@store',
                'can' => 'save.model_blocks'
            ]
        );
        Route::delete(
            '/module/delete',
            [
                'uses' => 'ModuleController@destroy',
                'can' => 'delete.model_blocks'
            ]
        );
        Route::put(
            '/module/update',
            [
                'uses' => 'ModuleController@update',
                'can' => 'update.model_blocks'
            ]
        );
        //....... module input end............


        //....... mtb start............
        Route::post(
            '/mtb/block_list',
            [
                'uses' => 'MTBController@blockList',
                'can' => 'list.model_blocks'
            ]
        );

        Route::post(
            '/mtb/excel_calculation',
            [
                'uses' => 'MTBController@excelCalculation',
                'can' => 'list.model_blocks'
            ]
        );


        //....... mtb end............

        //....... template start............
        Route::post(
            '/template/list',
            [
                'uses' => 'TemplateController@list',
                'can' => 'list.templates'
            ]
        );

        Route::post(
            '/template/shared_template_list',
            [
                'uses' => 'TemplateController@sharedTemplateList',
                'can' => 'list.templates'
            ]
        );

        Route::post(
            '/template/list_all_tools',
            [
                'uses' => 'TemplateController@listAllTools',
                'can' => 'list.templates'
            ]
        );

        Route::post(
            '/template/search',
            [
                'uses' => 'TemplateController@search',
                'can' => 'search.templates'
            ]
        );


        Route::delete(
            '/template/delete',
            [
                'uses' => 'TemplateController@destroy',
                'can' => 'delete.templates'
            ]
        );


        Route::post(
            '/template/own_template_list',
            [
                'uses' => 'TemplateController@ownTemplateList',
                'can' => 'list.templates'
            ]
        );
        Route::post(
            '/template/own_template_list_search',
            [
                'uses' => 'TemplateController@ownTemplateListSearch',
                'can' => 'list.templates'
            ]
        );


        Route::post(
            '/template/shared_with_me_template_list',
            [
                'uses' => 'TemplateController@sharedWithMeTemplateList',
                'can' => 'list.templates'
            ]
        );
        Route::post(
            '/template/shared_with_me_template_list_search',
            [
                'uses' => 'TemplateController@sharedWithMeTemplateListSearch',
                'can' => 'list.templates'
            ]
        );

        Route::post(
            '/template/shared_by_me_template_list',
            [
                'uses' => 'TemplateController@sharedByMeTemplateList',
                'can' => 'list.templates'
            ]
        );
        Route::post(
            '/template/shared_by_me_template_list_search',
            [
                'uses' => 'TemplateController@sharedByMeTemplateListSearch',
                'can' => 'list.templates'
            ]
        );

        Route::post(
            '/template/all_saved_template_list',
            [
                'uses' => 'TemplateController@allSavedTemplateList',
                'can' => 'list.templates'
            ]
        );
        Route::post(
            '/template/all_saved_template_list_search',
            [
                'uses' => 'TemplateController@allSavedTemplateListSearch',
                'can' => 'list.templates'
            ]
        );


        //....... template end............


        //....... Feed library settings start............
        Route::post(
            '/feed_settings/list',
            [
                'uses' => 'FeedSettingsController@list',
                'can' => 'list.feed_settings'
            ]
        );
        Route::post(
            '/feed_settings/save',
            [
                'uses' => 'FeedSettingsController@store',
                'can' => 'save.feed_settings'
            ]
        );
        Route::put(
            '/feed_settings/update',
            [
                'uses' => 'FeedSettingsController@update',
                'can' => 'update.feed_settings'
            ]
        );
        Route::delete(
            '/feed_settings/delete',
            [
                'uses' => 'FeedSettingsController@destroy',
                'can' => 'delete.feed_settings'
            ]
        );
        //....... Feed library settings end............

        // User logs started

        Route::post(
            'user/activity/logs',
            [
                'uses' => 'UserActivityController@logs',
                'can' => 'list.user_logs'
            ]
        );

        Route::delete(
            'user/activity/delete_logs',
            [
                'uses' => 'UserActivityController@deleteLogs',
                'can' => 'delete.user_logs'
            ]
        );

        Route::post(
            'user/activity/export',
            [
                'uses' => 'UserActivityController@export',
                'can' => 'export.user_logs'
            ]
        );
    }
);
