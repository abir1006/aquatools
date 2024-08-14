<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\TemplateNotesService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Config;
use Illuminate\Support\Facades\Auth;

class TemplateNotesController extends Controller
{
    protected $template_notes_service;
    private $userService;

    public function __construct(TemplateNotesService $template_notes_service, UserService $userService)
    {
        $this->template_notes_service = $template_notes_service;
        $this->userService = $userService;
    }

    public function list(Request $request)
    {
        $data['id'] = $request->get('template_id');
        $note = $this->template_notes_service->note_by_template($data);
        return response()->json($note, 200);
    }

    public function store(Request $request)
    {
        $template_note = $this->template_notes_service->save($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.saved'),
                'data' => $template_note
            ],
            201
        );
    }

    public function update(Request $request)
    {
        $template_note = $this->template_notes_service->update($request->all());

        return response()->json(
            [
                'message' => Config::get('settings.message.updated'),
                'data' => $template_note
            ],
            200
        );
    }

}
