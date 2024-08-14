<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\DB;
use Spatie\TranslationLoader\LanguageLine;

use function PHPSTORM_META\map;

class TranslationService
{

    public function import($data)
    {

        $list = [];
        $count = 0;
        $updateExistingKey = isset($data['update_existing_key']) ? $data['update_existing_key'] : false;

        $languages = $this->availableLanguage();

        //format data and createand update
        collect($data['parseData'])->each(function ($item) use ($languages, $updateExistingKey, &$list) {

            $key = $item['key'];
            $text = [];

            foreach ($languages as $language) {
                $code = $language['code'];
                $text[$code] = isset($item[$code]) ? $item[$code] : "";
            }

            $list[] = [
                'key' => $key,
                'group' => '*',
                'text' => $text
            ];

            //update and create create
            if ($updateExistingKey)
                LanguageLine::updateOrCreate(
                    ['key' => $key],
                    ['group' => '*', 'text' => $text]
                );
        });

        //only insert data
        if (!$updateExistingKey) {

            $availableTrans = LanguageLine::select('key')->get()->pluck('key')->toArray();

            $newData = collect($list)->filter(function ($item) use ($availableTrans) {
                return !in_array($item['key'], $availableTrans);
            })->map(function ($item) {
                $item['text'] = json_encode($item['text']);
                return $item;
            })->toArray();


            if ($count = count($newData))
                LanguageLine::insert($newData);
        } else
            $count = count($list);

        //flush translation cache
        LanguageLine::first()->save();

        return $count;
    }

    public function export()
    {

        $items = LanguageLine::orderBy('key', 'asc')->get();

        $columns = ['key'];
        $languages = $this->availableLanguage();
        foreach ($languages as $language) {
            $columns[] = $language['code'];
        }

        $callback = function () use ($items, $columns, $languages) {

            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($items as $item) {

                $row = [];
                array_push($row, $item->key);

                $text = $item->text;

                foreach ($languages as $language) {
                    $code = $language['code'];
                    $string = isset($text[$code]) ? $text[$code] : '';
                    array_push($row, $string);
                }

                fputcsv($file, $row);
            }
            fclose($file);
        };

        return $callback;
    }

    public function list($data)
    {
        $specialChars = ['%'];

        $search = isset($data['q']) && !empty($data['q']);
        $query = LanguageLine::orderBy('key', 'asc')
            ->when($search, function ($q) use ($data, $specialChars) {

                $searchKey = $data['q'];

                //make unicode to hex code
                $searchKey = in_array($searchKey, $specialChars) ? '\\' . $searchKey : addslashes(str_replace('"', '', json_encode($searchKey)));

                $q->where('key', 'iLIKE', "%{$searchKey}%");
                $q->orWhere('text', 'iLIKE', "%{$searchKey}%");

                // $languages = $that->availableLanguage();
                // foreach ($languages as $lang) {
                //     // $q->orWhereJsonContains(
                //     //     DB::raw('lower("text"::text)'),
                //     //     [$lang['code'] => strtolower($searchKey)]
                //     // );

                //     $q->orWhere('text->en', 'iLike', "%{$searchKey}%");
                // }
            });

        return $query->paginate(20);
    }


    public function create($data)
    {

        if (!isset($data['group']))
            $data['group'] = '*';

        return LanguageLine::create($data);
    }

    public function update($id, $data)
    {
        $item = LanguageLine::find($id);
        $item->update($data);
        return $item;
    }

    public function fetch($code)
    {
        $list = LanguageLine::getTranslationsForGroup($code, '*');
        return $list;
    }

    public function availableLanguage()
    {
        $siteLanguages = [
            ['name' => 'Norsk', 'code' => 'no'],
            ['name' => 'English', 'code' => 'en',]
        ];

        $siteSetting = SiteSetting::where('key', 'translation_default_lang')->first();
        $defaultLang = $siteSetting ? $siteSetting->value : 'no';
        $items = collect($siteLanguages)->map(function ($language) use ($defaultLang) {

            $language['default'] = $language['code'] == $defaultLang ? true : false;

            return $language;
        })->toArray();
        return $items;
    }
}
