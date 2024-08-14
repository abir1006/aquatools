<?php


namespace App\Services;

use App\Models\CustomField;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Config;


class CustomFieldService
{
    public function feedCustomFields($data)
    {
        return CustomField::where('company_id', $data['company_id'])->where('type', $data['type'])->first('fields');
    }

    public function save($data)
    {
        $hasFields = CustomField::where('company_id', $data['company_id'])->get()->count();
        if ($hasFields > 0) {
            return CustomField::where('company_id', $data['company_id'])->update($data);
        }
        return CustomField::create($data);
    }
}
