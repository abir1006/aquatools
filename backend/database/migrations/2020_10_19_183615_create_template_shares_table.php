<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplateSharesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('template_shares', function (Blueprint $table) {
            $table->id();
            $table->integer('template_id')->unsigned();
            $table->foreign('template_id')->references('id')->on('templates')->onDelete('cascade');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->tinyInteger('is_remove')->default(0)->comment('1-Yes,0-No');
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
        Schema::dropIfExists('template_shares');
    }
}
