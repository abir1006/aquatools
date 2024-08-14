<?php


namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Http\File as HttpFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    /**
     * @param $file_content
     * @param string $path
     * @param string $name
     * @return string
     */
    public function upload($file_content, $path = '', $name = ''): string
    {
        try {
            $the_file = File::get($file_content);
            $name = $name == '' ? time() . '.' . $file_content->getClientOriginalExtension() : $name;
            Storage::put($path . $name, $the_file);
            return $name;
        } catch (\Exception $e) {
            return response()->json(['message' => 'Upload failed'], 401);
        }
    }

    /**
     * @param $to
     * @param $from
     * @param $name
     * @return JsonResponse
     */
    public function copyAs($to, $from, $name)
    {
        try {
            Storage::putFileAs($to, new HttpFile($from), $name);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Copy failed'], 401);
        }
    }

}
