<?php

namespace App\Http\Middleware;

use App\Models\Material;
use App\Models\Template;
use App\Models\Tool;
use App\Models\User;
use App\Models\UserActivity;
use Closure;
use Illuminate\Support\Facades\Auth;

class AddToActivityLogs
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $screens_to_log = [];

        $exclude_roles = []; // 'super_admin'

        $response = $next($request);

        $array_response = json_decode($response->getContent(), true);

        // If there are any validation errors exist in request then skip the logs
        if (isset($array_response['errors'])) {
            return $response;
        }

        $action_url = request()->segment(2);
        if (request()->segment(3) != '') {
            $action_url .= '/' . request()->segment(3);
        }
        if (request()->segment(4) != '') {
            $action_url .= '/' . request()->segment(4);
        }

        $referral_page = str_replace('/admin/', '', parse_url(request()->headers->get('referer'))['path']);

        $tools = array(
            'genetics' => 'Genetics',
            'mtb' => 'MTB',
            'kn_for' => 'Feed C/B',
            'vaksinering' => 'Vaccination',
            'cost_of_disease' => 'Cost of Disease',
            'optimalisering' => 'Optimization',
        );

        $tools_by_id = array(
            1 => 'Genetics',
            4 => 'MTB',
            5 => 'Feed C/B',
            6 => 'Vaccine',
            3 => 'Cost of disease',
            2 => 'Optimization',
        );

        $model_routes = array(
            'genetics' => 'Genetics',
            'mtb' => 'MTB',
            'feedModel' => 'Feed C/B',
            'vaccine' => 'Vaccination',
            'cod' => 'Cost of disease',
            'optimalisering' => 'Optimization',
        );

        $logout_page_name = '';
        if (request()->get('logout_page')) {
            $logout_page_name = request()->get('logout_page');
            if (is_numeric(request()->get('logout_page'))) {
                $tool_id = request()->get('logout_page');
                $tool_data = Tool::find($tool_id);
                $logout_page_name = $tool_data->slug;
            }
        }


        // permitted routes to logs
        $screens_to_log = array(
            'login' => array(
                'type' => 'Logged in',
                'name' => 'Login'
            ),
            'dashboard/statistics' => array(
                'type' => 'Viewed',
                'name' => 'Dashboard'
            ),
            'user/save' => array(
                'type' => 'Created',
                'name' => 'Users'
            ),
            'user/edit' => array(
                'type' => 'Viewed details',
                'name' => 'Users'
            ),
            'user/update' => array(
                'type' => 'Updated',
                'name' => 'Users'
            ),
            'user/delete' => array(
                'type' => 'Deleted',
                'name' => 'Users'
            ),
            'user/change_status' => array(
                'type' => 'Changed status',
                'name' => 'Users'
            ),
            'user/change_password' => array(
                'type' => 'Changed password',
                'name' => 'Users'
            ),
            'user/search' => array(
                'type' => 'Searched',
                'name' => 'Users'
            ),
            'user/logout' => array(
                'type' => 'Logged out',
                'name' => array_key_exists($logout_page_name, $tools) ? $tools[$logout_page_name] . ' model' : ucfirst(
                    str_replace('_', ' ', $logout_page_name)
                )
            ),
            'company/list' => array(
                'type' => 'Viewed',
                'name' => 'Companies'
            ),
            'company/search' => array(
                'type' => 'Searched',
                'name' => 'Companies'
            ),
            'company/save' => array(
                'type' => 'Created',
                'name' => 'Companies'
            ),
            'company/update' => array(
                'type' => 'Updated',
                'name' => 'Companies'
            ),
            'company/delete' => array(
                'type' => 'Deleted',
                'name' => 'Companies'
            ),
            'company/change_status' => array(
                'type' => 'Changed status ',
                'name' => 'Companies'
            ),
            'company/edit' => array(
                'type' => 'Viewed details',
                'name' => 'Companies'
            ),
            'template/delete' => array(
                'type' => 'Deleted',
                'name' => 'Templates'
            ),
            'template/remove_share' => array(
                'type' => 'Removed share',
                'name' => 'Templates'
            ),
            'report/search' => array(
                'type' => 'Searched',
                'name' => 'Reports'
            ),
            'report/delete' => array(
                'type' => 'Deleted',
                'name' => 'Reports'
            ),
            'user/profile' => array(
                'type' => 'Viewed',
                'name' => 'Profile'
            ),
            'user/profile/update' => array(
                'type' => 'Updated',
                'name' => 'Profile info'
            ),
            'user/profile-picture/update' => array(
                'type' => 'Updated',
                'name' => 'Profile picture'
            ),
            'user/password/update' => array(
                'type' => 'Updated',
                'name' => 'Profile password'
            ),
            'feed/save' => array(
                'type' => 'Created',
                'name' => 'Feed library'
            ),
            'feed/update' => array(
                'type' => 'Updated',
                'name' => 'Feed library'
            ),
            'feed/delete' => array(
                'type' => 'Deleted',
                'name' => 'Feed library'
            ),

            'material/listAll' => array(
                'type' => 'Viewed',
                'name' => 'AT Material'
            ),
            'material/save' => array(
                'type' => 'Created',
                'name' => 'AT Material'
            ),
            'material/update' => array(
                'type' => 'Updated',
                'name' => 'AT Material'
            ),
            'material/delete' => array(
                'type' => 'Deleted',
                'name' => 'AT Material'
            ),
            'materialResource/delete' => array(
                'type' => 'Deleted resource',
                'name' => 'AT Material'
            ),
            'material/search' => array(
                'type' => 'Searched',
                'name' => 'AT Material'
            ),
            'tags' => array(
                'type' => 'Viewed',
                'name' => 'AT Material Tags'
            ),
            'role/save' => array(
                'type' => 'Created',
                'name' => 'Role Settings'
            ),
            'role/update' => array(
                'type' => 'Updated',
                'name' => 'Role Settings'
            ),
            'role/delete' => array(
                'type' => 'Deleted',
                'name' => 'Role Settings'
            ),
            'invoice_setting/save' => array(
                'type' => 'Created',
                'name' => 'Invoice Settings'
            ),
            'invoice_setting/update' => array(
                'type' => 'Updated',
                'name' => 'Invoice Settings'
            ),
            'invoice_setting/delete' => array(
                'type' => 'Deleted',
                'name' => 'Invoice Settings'
            ),
            'tool/save' => array(
                'type' => 'Created',
                'name' => 'Model Settings'
            ),
            'tool/update' => array(
                'type' => 'Updated',
                'name' => 'Model Settings'
            ),
            'tool/delete' => array(
                'type' => 'Deleted',
                'name' => 'Model Settings'
            ),
            'permission/save' => array(
                'type' => 'Created',
                'name' => 'ACL Permission'
            ),
            'permission/update' => array(
                'type' => 'Updated',
                'name' => 'ACL Permission'
            ),
        );

        if (request()->route()->getName() == 'template.rename') {
            $action_url = 'template/rename';
            $screens_to_log[$action_url] = array(
                'type' => 'Updated',
                'name' => 'Templates'
            );
        }

        if ($action_url == 'report/list' && request()->get('pageName') == 'reports') {
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'Reports'
            );
        }

        if ($action_url == 'download/file') {
            $screens_to_log[$action_url] = array(
                'type' => isset($request->all()['fileName']) ? 'Downloaded (' . $request->all()['fileName'] . ')' : '',
                'name' => isset($request->all()['pageName']) ? $request->all()['pageName'] : '',
            );
        }

        if ($action_url == 'template/own_template_list' && request()->get('pageName') == 'templates') {
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'Templates'
            );
        }

        if ($action_url == 'user/list' && request()->get('pageName') == 'users') {
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'Users'
            );
        }

        if ($action_url == 'feed/list' && request()->get('pageName') != '') {
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'Feed library'
            );
        }

        if ($action_url == 'material/list' && request()->get('featured') == '') {
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'AT Material'
            );
        }

        if ($action_url == 'mtb/block_list' && isset($request->all()['tool_slug'])) {
            $screens_to_log['mtb/block_list'] = array(
                'type' => 'Viewed',
                'name' => $tools[$request->all()['tool_slug']] . ' model'
            );
        }

        if ($action_url == 'template/save') {
            $screens_to_log[$action_url] = array(
                'type' => 'Created',
                'description' => 'template "'.$request->all()['name'].'"',
                'name' => $tools_by_id[$request->all()['tool_id']] . ' model'
            );
        }

        if ($action_url == 'template/update') {
            $template_data = Template::find($request->all()['id']);
            $screens_to_log[$action_url] = array(
                'type' => 'Updated',
                'description' => 'template "' . $template_data->name . '"',
                'name' => $tools_by_id[$template_data->tool_id] . ' model'
            );
        }

        if ($action_url == 'template/share') {
            $template_data = Template::find($request->all()['template_id']);
            $screens_to_log[$action_url] = array(
                'type' => 'Shared',
                'description' => 'template "' . $template_data->name . '"',
                'name' => 'Templates'
            );
        }

        // Log model input change
        if ((request()->segment(3) == 'calculation' || request()->segment(3) == 'excel_calculation') && request()->get(
            'pageName'
        ) == '') {
            $screens_to_log[$action_url] = array(
                'type' => 'Changed input',
                'name' => $model_routes[request()->segment(2)] . ' model'
            );
        }

        if (request()->segment(2) == 'categories' && request()->get('page') == 'category') {
            $action_url = 'categories/page';
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'AT Material Categories'
            );
        }

        if (request()->segment(2) == 'role' && request()->segment(3) == 'list' && request()->get(
            'page'
        ) == 'settings-role') {
            $action_url = 'settings/role/list';
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'Role Settings'
            );
        }

        if (request()->segment(2) == 'role' && request()->segment(3) == 'list' && request()->get(
            'page'
        ) == 'settings-acl') {
            $action_url = 'settings/acl';
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'ACL Settings'
            );
        }

        if (request()->segment(2) == 'invoice_setting' && request()->segment(3) == 'list' && request()->get(
            'page'
        ) == 'settings-invoice') {
            $action_url = 'settings/acl';
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'Invoice Settings'
            );
        }

        if (request()->segment(2) == 'tool' && request()->segment(3) == 'list' && request()->get(
            'page'
        ) == 'settings-models') {
            $action_url = 'settings/acl';
            $screens_to_log[$action_url] = array(
                'type' => 'Viewed',
                'name' => 'Model Settings'
            );
        }

        if (request()->segment(2) == 'tags' && strtolower(request()->method()) == 'post') {
            $action_url = 'tags/save';
            $screens_to_log[$action_url] = array(
                'type' => 'Created',
                'name' => 'AT Material Tags'
            );
        }

        if (request()->segment(2) == 'tags' && strtolower(request()->method()) == 'delete') {
            $action_url = 'tags/delete';
            $screens_to_log[$action_url] = array(
                'type' => 'Deleted',
                'name' => 'AT Material Tags'
            );
        }

        if (request()->segment(2) == 'tags' && strtolower(request()->method()) == 'put') {
            $action_url = 'tags/update';
            $screens_to_log[$action_url] = array(
                'type' => 'Updated',
                'name' => 'AT Material Tags'
            );
        }

        if (request()->segment(2) == 'categories' && strtolower(request()->method()) == 'post') {
            $action_url = 'categories/save';
            $screens_to_log[$action_url] = array(
                'type' => 'Created',
                'name' => 'AT Material Categories'
            );
        }

        if (request()->segment(2) == 'categories' && strtolower(request()->method()) == 'delete') {
            $action_url = 'categories/delete';
            $screens_to_log[$action_url] = array(
                'type' => 'Deleted',
                'name' => 'AT Material Categories'
            );
        }

        if (request()->segment(2) == 'categories' && strtolower(request()->method()) == 'put') {
            $action_url = 'categories/update';
            $screens_to_log[$action_url] = array(
                'type' => 'Updated',
                'name' => 'AT Material Categories'
            );
        }

        if (request()->segment(2) == 'material' && is_numeric(request()->segment(3))) {
            $material = Material::find(request()->segment(3));
            $material_name = '';
            if ($material) {
                $material_name = $material->title;
            }
            $screens_to_log['material/' . request()->segment(3)] = array(
                'type' => 'Viewed details (' . $material_name . ')',
                'name' => 'AT Material'
            );
        }

        // pdf download

        if (request()->segment(3) == 'download-pdf') {
            $screens_to_log[$action_url] = array(
                'type' => 'Downloaded a PDF report',
                'name' => $model_routes[request()->segment(2) == 'model' ? 'mtb' : request()->segment(2)] . ' model'
            );
        }

        if (request()->segment(3) == 'download-pdf' && $request->all()['sendToMe'] == true) {
            $screens_to_log[$action_url] = array(
                'type' => 'Sent a PDF report to own email',
                'name' => $model_routes[request()->segment(2) == 'model' ? 'mtb' : request()->segment(2)] . ' model'
            );
        }

        if (request()->segment(3) == 'download-pdf' && $request->all()['sendToEmail'] == true) {
            $screens_to_log[$action_url] = array(
                'type' => 'Sent a PDF report to others email',
                'name' => $model_routes[request()->segment(2) == 'model' ? 'mtb' : request()->segment(2)] . ' model'
            );
        }

        // ppt download

        if (request()->segment(3) == 'download-ppt') {
            $screens_to_log[$action_url] = array(
                'type' => 'Downloaded a PPT report',
                'name' => $model_routes[request()->segment(2) == 'model' ? 'mtb' : request()->segment(2)] . ' model'
            );
        }

        if (request()->segment(3) == 'download-ppt' && $request->all()['sendToMe'] == true) {
            $screens_to_log[$action_url] = array(
                'type' => 'Sent a PPT report to own email',
                'name' => $model_routes[request()->segment(2) == 'model' ? 'mtb' : request()->segment(2)] . ' model'
            );
        }

        if (request()->segment(3) == 'download-ppt' && $request->all()['sendToEmail'] == true) {
            $screens_to_log[$action_url] = array(
                'type' => 'Sent a PPT report to others email',
                'name' => $model_routes[request()->segment(2) == 'model' ? 'mtb' : request()->segment(2)] . ' model'
            );
        }

        if ($action_url == 'user/delete' && isset($request->all()['page']) && $request->all()['page'] == 'Profile') {
            UserActivity::create(
                [
                    'user_id' => null,
                    'type' => $request->all()['type'],
                    'company_id' => $request->all()['company_id'],
                    'screen' => $request->all()['page'],
                ]
            );

            return $response;
        }

        if (auth()->user() && array_key_exists($action_url, $screens_to_log)) {
            $full_url = request()->fullUrl();
            $current_user = User::with('roles')->find(Auth::id());
            $current_user_role = $current_user['roles'][0]['slug'];
            if (!in_array(
                $current_user_role,
                $exclude_roles
            )) {
                UserActivity::create(
                    [
                        'user_id' => auth()->id(),
                        'type' => $screens_to_log[$action_url]['type'],
                        'description' => isset($screens_to_log[$action_url]['description']) ? $screens_to_log[$action_url]['description'] : null,
                        'company_id' => auth()->user()->company_id,
                        'screen' => $screens_to_log[$action_url]['name'],
                    ]
                );
            }
        }

        return $response;
    }
}
