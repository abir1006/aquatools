<?php

namespace App\Services;

use App\Models\TemplateNote;
use Config;
use DB;


class TemplateNotesService
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function note_by_template($data)
    {
        return TemplateNote::where('template_id', $data['id'])->first();
    }

    public function save($data)
    {
        $template_note = TemplateNote::create($data);
        return TemplateNote::find($template_note->id);
    }

    public function update($data)
    {
        $id = $data['id'];
        TemplateNote::findOrFail($id)->update($data);
        return TemplateNote::find($id);
    }

    public function delete($id)
    {
        TemplateNote::findOrFail($id);
        return TemplateNote::destroy($id);
    }
}
