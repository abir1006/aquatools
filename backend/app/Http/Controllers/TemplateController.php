<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\TemplateAllToolListRequest;
use App\Http\Requests\TemplateRemoveShareRequest;
use App\Http\Requests\TemplateStoreRequest;
use App\Http\Requests\TemplateUpdateRequest;
use App\Http\Requests\TemplateListRequest;
use \App\Http\Requests\TemplateShareStoreRequest;
use App\Http\Requests\SendRequest;
use App\Http\Requests\DeleteRequest;
use App\Http\Requests\StatusUpdateRequest;
use App\Http\Requests\TemplateRenameRequest;
use App\Http\Requests\TemplateUserListRequest;
use App\Models\Template;
use App\Models\TemplateShare;
use App\Notifications\NotifyUsersForTemplateShared;
use App\Notifications\NotifyUsersForTemplateUpdate;
use App\Services\TemplateService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Config;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;

class TemplateController extends Controller
{
    protected $templateService;
    private $userService;

    public function __construct(TemplateService $templateService, UserService $userService)
    {
        $this->templateService = $templateService;
        $this->userService = $userService;
    }

    public function rename(TemplateRenameRequest $request, $id)
    {
        return response()->json($this->templateService->rename($id, $request->name), 200);
    }
    public function import(Request $request)
    {
        return response()->json($this->templateService->import($request->all()), 200);
    }
    public function export(Request $request, Template $id)
    {
        return response()->make($id, 200);
    }
    public function list(TemplateListRequest $request)
    {
        $templates = $this->templateService->list($request->all());
        return response()->json($templates, 200);
    }

    public function sharedTemplateList(TemplateListRequest $request)
    {
        $templates = $this->templateService->sharedTemplateList($request->all());
        return response()->json($templates, 200);
    }

    public function listAllTools(TemplateAllToolListRequest $request)
    {
        $templates = $this->templateService->listAllTools($request->all());
        return response()->json($templates, 200);
    }

    public function search(Request $request)
    {
        $company = $this->templateService->search($request->all());
        return response()->json($company, 200);
    }

    public function store(TemplateStoreRequest $request)
    {
        $template = $this->templateService->save($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $template
            ],
            201
        );
    }

    public function update(TemplateUpdateRequest $request)
    {
        $template = $this->templateService->update($request->all());

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

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $template
            ],
            200
        );
    }

    public function destroy(DeleteRequest $request)
    {
        $this->templateService->delete($request->id);

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted'),
            ],
            200
        );
    }

    public function removeShare(TemplateRemoveShareRequest $request)
    {
        //$this->templateService->removeShare($request->all());

        $this->templateService->removeShare($request->id);

        return response()->json(
            [
                'message' => Config::get('settings.message.deleted')
            ],
            200
        );
    }

    public function send(SendRequest $request)
    {
        $this->templateService->send($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated')
            ],
            200
        );
    }

    public function share(TemplateShareStoreRequest $request)
    {
        // First find notify users with whom has/ have been shared the template
        $data = $request->all();
        $notifyUsers = new \stdClass();
        if (isset($data['share_type']) && $data['share_type'] == 'all_users') {
            $templateNotSharedUsers = $this->templateService->userList($data)->pluck('id');

            $users = [];
            foreach ($templateNotSharedUsers as $user_id) {
                $users[] = $user_id;
            }

            // find users again to object structure send in notification trait
            $notifyUsers = $this->userService->getUsersByID($users);
        }

        // Then share template
        $template = $this->templateService->share($request->all());

        // find all users with whom template not shared and send notifications
        if (isset($data['share_type']) && $data['share_type'] == 'all_users') {
            Notification::send($notifyUsers, new NotifyUsersForTemplateShared($template, Auth::user()));
            return response()->json(
                [
                    'message' => Config::get('settings.message.saved')
                ],
                200
            );
        }

        $users = [];
        foreach ($data['users'] as $user) {
            $users[] = $user['user_id'];
        }
        $notifyUsers = $this->userService->getUsersByID($users);

        Notification::send($notifyUsers, new NotifyUsersForTemplateShared($template, Auth::user()));

        return response()->json(
            [
                'message' => Config::get('settings.message.saved')
            ],
            200
        );
    }

    public function userList(TemplateUserListRequest $request)
    {
        $templateUsers = $this->templateService->userList($request->all());
        $templateUsers = $templateUsers->paginate(Config::get('settings.pagination.per_page'));
        return response()->json($templateUsers, 200);
    }

    public function userListSearch(TemplateUserListRequest $request)
    {
        $templateUsers = $this->templateService->userListSearch($request->all());
        return response()->json($templateUsers, 200);
    }

    public function ownTemplateList(Request $request)
    {
        $template = $this->templateService->ownTemplateList($request->all());
        return response()->json($template, 200);
    }

    public function ownTemplateListSearch(Request $request)
    {
        $company = $this->templateService->ownTemplateListSearch($request->all());
        return response()->json($company, 200);
    }

    public function sharedWithMeTemplateList(Request $request)
    {
        $template = $this->templateService->sharedWithMeTemplateList($request->all());
        return response()->json($template, 200);
    }

    public function sharedWithMeTemplateListSearch(Request $request)
    {
        $company = $this->templateService->sharedWithMeTemplateListSearch($request->all());
        return response()->json($company, 200);
    }

    public function sharedByMeTemplateList(Request $request)
    {
        $template = $this->templateService->sharedByMeTemplateList($request->all());
        return response()->json($template, 200);
    }

    public function sharedByMeTemplateListSearch(Request $request)
    {
        $template = $this->templateService->sharedByMeTemplateListSearch($request->all());
        return response()->json($template, 200);
    }

    public function allSavedTemplateList(Request $request)
    {
        $template = $this->templateService->allSavedTemplateList($request->all());
        return response()->json($template, 200);
    }

    public function allSavedTemplateListSearch(Request $request)
    {
        $template = $this->templateService->allSavedTemplateListSearch($request->all());
        return response()->json($template, 200);
    }

    public function listDropdown(Request $request)
    {
        $template = $this->templateService->templateListDropdown($request->all());
        return response()->json($template, 200);
    }
}
