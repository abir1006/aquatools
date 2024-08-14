<?php

namespace App\Services;

use App\Models\BlockInput;
use Config;
use Illuminate\Support\Facades\DB;
use Spatie\TranslationLoader\LanguageLine;

class BlockInputService
{

    public function __construct()
    {
    }

    public function list($data)
    {
        $block_id = $data['block_id'];
        return BlockInput::where('block_id', $block_id)
            ->orderBy('input_order', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function save($data)
    {
        // get last input field order number
        $block_inputs = BlockInput::where('block_id', $data['block_id'])->orderBy('input_order', 'desc')->first();

        // set first input order 1
        if (!$block_inputs) {
            $data['input_order'] = 1;
        }

        if ($block_inputs && $block_inputs->input_order != null) {
            $data['input_order'] = $block_inputs->input_order + 1;
        }

        $blockInput = BlockInput::create($data);
        return BlockInput::find($blockInput->id);
    }

    public function update($data)
    {
        $id = $data['id'];
        BlockInput::findOrFail($id)->update($data);

        //update translation for help text
        if ($key = $data['help_text'])
            LanguageLine::updateOrCreate(
                ['key' => $key],
                ['group' => '*', 'text' => $data['helpText']]
            );

        return BlockInput::find($id);
    }

    public function updateOrder($data)
    {
        // first check if block input's ordering column has values

        $count_block_inputs = BlockInput::where('block_id', $data['block_id'])
            ->where('input_order', null)->get()->count();

        // if any input column does have order value than set order first
        if ($count_block_inputs > 0) {
            foreach ($data['all_orders'] as $row) {
                BlockInput::where('id', $row['id'])->update(['input_order' => $row['input_order']]);
            }

            return [];
        }

        // Drag n drop sorting database logic
        if ($data['changed_order'] > $data['present_order']) {
            DB::statement(
                'update block_inputs set input_order = input_order-1 where block_id = ' . $data['block_id'] . ' and input_order >= ' . $data['present_order'] . ' and input_order <=' . $data['changed_order']
            );
            DB::statement(
                'update block_inputs set input_order = ' . $data['changed_order'] . ' where id=' . $data['id']
            );
        }

        if ($data['changed_order'] < $data['present_order']) {
            DB::statement(
                'update block_inputs set input_order = input_order+1 where block_id = ' . $data['block_id'] . ' and input_order >= ' . $data['changed_order'] . ' and input_order <=' . $data['present_order']
            );
            DB::statement(
                'update block_inputs set input_order = ' . $data['changed_order'] . ' where id=' . $data['id']
            );
        }

        return [];
    }

    public function delete($id)
    {
        //BlockInput::findOrFail($id);
        return BlockInput::destroy($id);
    }

    public function changeStatus($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $company = BlockInput::findOrFail($id);
        $company->status = $status;
        $company->save();

        return $company;
    }
}
