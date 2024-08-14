<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddToolIdToTemperatureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('temperature_template', function (Blueprint $table) {
            //
            $table->integer('tool_id')->unsigned()->nullable()->after('company_id');
            $table->foreign('tool_id')->references('id')->on('tools')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('temperature_template', function (Blueprint $table) {
            //

        });
    }
}
