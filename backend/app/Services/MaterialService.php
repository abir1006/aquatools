<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Material;
use App\Models\MaterialResource;
use App\Models\Tag;
use App\Models\User;
use App\Notifications\MaterialAdded;
use Illuminate\Support\Facades\File;

use Config;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Image;


class MaterialService
{
    private $userService;
    private $fileService;

    public function __construct(UserService $userService, FileService $fileService)
    {
        $this->userService = $userService;
        $this->fileService = $fileService;
    }

    public function saveOrder($data)
    {

        foreach ($data as $item) {

            $id = $item['id'];
            $order = $item['order'];

            $mat = Material::find($id);
            $mat->sort_order = $order;
            $mat->is_featured = $item['is_featured'];
            $mat->save();
        }
    }

    public function removeNotification($material, $ids)
    {
        $oldTools = $material->tools->pluck('id')->toArray();
        $newTools = collect($ids)->filter(function ($id) use ($oldTools) {
            return !in_array($id, $oldTools);
        })->toArray();

        $newCompanies = Company::whereHas('tools', function ($q) use ($newTools) {
            return $q->whereIn('tool_id', $newTools);
        })->pluck('id')->toArray();

        $users = Company::with('users')
            ->whereHas('tools', function ($q) use ($oldTools) {
                return $q->whereIn('tool_id', $oldTools);
            })
            ->get()
            ->filter(function ($company) use ($newCompanies) {
                return !in_array($company->id, $newCompanies);
            })
            ->map(function ($company) {
                return $company->users;
            })
            ->flatten()
            ->map(function ($user) {
                return $user->id;
            })
            ->toArray();


        //delete notifications
        DatabaseNotification::where('type', 'App\Notifications\MaterialAdded')
            ->whereIn('notifiable_id', $users)
            ->whereJsonContains('data', ['id' => $material->id])
            ->delete();
    }

    public function sendNotifications($material, $toolIds)
    {
        //send notifications

        $currentUserId = $this->userService->getLoggedInUser()->id;

        // notification already sent
        $usersAlreadyGotNotification = DatabaseNotification::where('type', 'App\Notifications\MaterialAdded')
            ->whereJsonContains('data', ['id' => $material->id])
            ->select('notifiable_id')
            ->get()
            ->pluck('notifiable_id')
            ->toArray();

        // add super admin to this list
        $usersAlreadyGotNotification[] = $currentUserId;

        $userIds = Company::with('users')->whereHas('tools', function ($q) use ($toolIds) {
            $q->whereIn('tool_id', $toolIds);
        })->get()
            ->filter(function ($company) {
                return $company->users->count();
            })
            ->map(function ($company) {
                return $company->users;
            })
            ->flatten()
            ->map(function ($user) {
                return $user->id;
            })
            ->filter(function ($userId) use ($usersAlreadyGotNotification) {
                return !in_array($userId, $usersAlreadyGotNotification);
            })
            ->toArray();

        $users = User::whereIn('id', $userIds)->get();
        Notification::send($users, new MaterialAdded($material));
    }


    public function markAsRead($id)
    {
        $notification = $this->userService->getLoggedInUser()->notifications()->find($id);

        $notification && $notification->markAsRead();
    }

    public function unreadMaterialNotifications()
    {
        $currentUser = $this->userService->getLoggedInUser();

        return $currentUser->unreadNotifications->where('type', 'App\Notifications\MaterialAdded')->toArray();
    }

    public function categories()
    {
        return Material::categories();
    }

    public function list($perPage = 9)
    {
        $user = $this->userService->getCurrentUser();
        $permittedTools = $user->company->tools;

        $tools = $permittedTools;

        return Material::byTools($tools)
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->when(request('featured'), function ($q) {
                return $q->where('is_featured', true);
            })
            ->when(!request('featured') && !request('all'), function ($q) {
                return $q->where('is_featured', false);
            })
            ->paginate($perPage);
    }

    public function getSingle($id)
    {
        $user = $this->userService->getCurrentUser();
        $tools = $user->company->tools;

        return Material::byTools($tools)->where('id', $id)->firstOrFail();
    }

    public function search($data)
    {
        $user = $this->userService->getCurrentUser();
        $permittedTools = $user->company->tools;

        $tools = $data['model'] ? $permittedTools->filter(function ($tool) use ($data) {
            return $tool->tool->id == $data['model'];
        }) : $permittedTools;

        return Material::byTools($tools)
            ->filter($data)
            ->where('is_featured', false)
            ->orderBy('sort_order', 'asc')
            ->paginate(9);
    }


    public function listAll()
    {
        return Material::where('status', 1)->get(['id', 'type', 'title']);
    }

    public function updateTags($data)
    {
        $tags = json_decode($data['tags'], 1);
        $ids = [];

        foreach ($tags as $item) {

            $id = $item['id'];
            $name = $item['name'];

            if (intval($id)) {
                $ids[] = $id;
            } else if (!intval($id and $name)) {
                $tag = Tag::create(['name' => $name]);
                $ids[] = $tag->id;
            }
        }

        return $ids;
    }

    public function save($data)
    {

        $data['is_free'] = $data['is_free'] == 'true' ? 1 : 0;

        $material = Material::create($data);

        //create/update tags
        if (isset($data['tags']) && !empty($data['tags'])) {

            $ids = $this->updateTags($data);
            $material->tags()->sync($ids);
        }

        //store tools
        if (isset($data['tools']) && !empty($data['tools'])) {
            $ids = explode(',', $data['tools']);
            $material->tools()->sync($ids);
            //send notifications
            $this->sendNotifications($material, $ids);
        }

        //store attachments
        if (isset($data['fileData']) && !empty($data['fileData'])) {

            $material->materialResources()->createMany($data['fileData']);
        }


        return $material;
    }

    public function update($data)
    {
        $id = $data['id'];
        $data['is_free'] = $data['is_free'] == 'true' ? 1 : 0;

        $material = Material::findOrFail($id);

        $material->update($data);

        //create/update tags
        if (isset($data['tags']) && !empty($data['tags'])) {

            $ids = $this->updateTags($data);
            $material->tags()->sync($ids);
        }

        //update tools
        if (isset($data['tools']) && !empty($data['tools'])) {

            $ids = explode(',', $data['tools']);
            $existingIds = $material->tools->pluck('id')->toArray();
            $material->tools()->sync($ids);

            //send notifications
            $newIds = collect($ids)->filter(function ($id) use ($existingIds) {
                return !in_array($id, $existingIds);
            })->toArray();

            $this->sendNotifications($material, $newIds);
            //remove notifications when uncheck any model/tool
            $this->removeNotification($material, $ids);
        }

        if (isset($data['fileData']) && !empty($data['fileData'])) {

            $items = collect($data['fileData']);


            $newItems = $items->filter(function ($item, $k) {

                return !isset($item['id']) || $item['id'] < 1;
            });

            $existingItems = $items->filter(function ($item, $k) {
                return $item['id'] > 0;
            });


            //update and remove items
            if ($existingItems->count()) {

                $ids = $existingItems->map(function ($item) {
                    return $item['id'];
                })->all();

                //remove items those are removed from frontend
                MaterialResource::whereNotIn('id', $ids)->where('materials_id', $id)->delete();

                //update items
                foreach ($existingItems as $item) {

                    $resource = MaterialResource::find($item['id']);
                    unset($item['id']);
                    $resource->update($item);
                }
            }

            //save new items
            if ($newItems->count()) {
                $newItems = $newItems->map(function ($item) {
                    unset($item['id']);
                    return $item;
                })->all();

                $material->materialResources()->createMany($newItems);
            }
        }

        return $material;
    }


    public function delete($data)
    {
        $id = $data['id'];
        $material = Material::findOrFail($id);

        // delete uploaded resources
        foreach ($material->materialResources as $resource) {

            if ($name = $resource->file_name) {
                $path = public_path() . '/uploads/materials/' . $name;
                if (file_exists($path))
                    @unlink($path);
            }
            //delete thumbnail
            if (in_array($resource->file_type, Material::imageType())) {

                $path = public_path() . '/uploads/materials/thumbnail/' . $resource->file_name;
                if (file_exists($path))
                    unlink($path);
            }
        }

        //delete db relation data
        $material->materialResources()->delete();

        //delete notifications
        DatabaseNotification::where('type', 'App\Notifications\MaterialAdded')
            ->whereJsonContains('data', ['id' => $material->id])
            ->delete();

        //delete material itself
        return Material::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $Material = Material::findOrFail($id);
        $Material->status = $status;
        $Material->save();

        return $Material;
    }

    public function fileUpload($resources)
    {

        $i = 0;

        $fileData = [];
        $path = public_path() . '/uploads/materials';
        $thumbnailPath = public_path() . '/uploads/materials/thumbnail';

        if (!File::isDirectory($path)) {

            File::makeDirectory($path, 0777, true, true);
        }

        if (!File::isDirectory($thumbnailPath)) {

            File::makeDirectory($thumbnailPath, 0777, true, true);
        }


        if (is_array($resources)) {

            //save videos
            if (isset($resources['videos']) and is_array(($resources['videos']))) {

                foreach ($resources['videos'] as $file) {

                    $fileData[$i]['id'] = (int)$file['id'];
                    $fileData[$i]['file_type'] = 'vimeo';
                    $fileData[$i]['file_name'] = $file['image'];
                    $fileData[$i]['is_default'] = false;
                    $fileData[$i]['caption'] = $file['caption'];
                    $fileData[$i]['excerpt'] = $file['excerpt'];

                    $i++;
                }
            }

            //upload images and documents
            foreach ($resources as $type => $files) {

                if ($type == 'videos')
                    continue;


                foreach ($files as $fileArr) {


                    $file = $fileArr['image'];

                    //upload images, docs
                    if (is_object($file)) {
                        $extension = $file->getClientOriginalExtension();
                        $name = uniqid() . '_' . $file->getClientOriginalName();
                        //make thumbnail for image
                        if (in_array($extension, Material::imageType())) {
                            $img = Image::make($file->path());
                            $img->resize(150, 100, function ($constraint) {
                                $constraint->aspectRatio();
                            })->save('/tmp/' . $name);
                            $this->fileService->copyAs('uploads/materials/thumbnail', '/tmp/' . $name, $name);
                        }

                        $name = $this->fileService->upload($file, 'uploads/materials/', $name);

                        $fileData[$i]['file_type'] = $extension;
                        $fileData[$i]['file_name'] = $name;
                    }

                    //when update mode
                    $id = $fileArr['id'];
                    $fileData[$i]['id'] = (int)$id;

                    //when update mode and changed any upload
                    if (is_object($file) and $id) {

                        //remove image/docs from disk
                        $this->removeResourceFileFromDisk($id);
                    }

                    $fileData[$i]['is_default'] = $fileArr['is_default'] == 'true' ? true : false;
                    $fileData[$i]['caption'] = $fileArr['caption'];
                    $fileData[$i]['excerpt'] = $fileArr['excerpt'];
                    $i++;
                }
            }
        }

        return $fileData;
    }

    public function removeResourceFileFromDisk($id)
    {
        # code...
    }

    public function deleteMaterialResources($data)
    {
        $materialResource = MaterialResource::findOrFail($data['id']);

        $file_path = public_path() . '/uploads/materials/' . $materialResource->file_name;

        File::delete($file_path);

        return $materialResource->delete();
    }
}
