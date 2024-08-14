<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropAndRecreateMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::dropIfExists('company_materials');
        Schema::dropIfExists('materials');
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('type',100)->nullable();
            $table->string('title', 500)->nullable();
            $table->string('details',1000)->nullable();
            $table->string('slug', 100)->nullable();
            $table->json('price')->nullable();
            $table->integer('discount')->unsigned()->nullable();
            $table->tinyInteger('is_free')->default(0)->comment('0 Not Free, 1 Free');
            $table->tinyInteger('status')->default(1)->comment('1 Active, 0 Blocked');
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
        //
        Schema::dropIfExists(table('materials'));
    }
}
