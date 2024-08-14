<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaterialsResources extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('materials_resources', function (Blueprint $table) {
            $table->id();
            $table->integer('materials_id')->unsigned();
            $table->foreign('materials_id')->references('id')->on('materials');
            $table->string('file_name',500)->nullable();
            $table->string('file_type', 500)->nullable();
            $table->tinyInteger('status')->default(1)->comment('1-Active,0-Inactive');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('materials_resources');
    }
}
