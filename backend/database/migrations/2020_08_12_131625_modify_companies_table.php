<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->text('address_line_1')->nullable();
            $table->text('address_line_2')->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->string('logo', 255)->nullable();
            $table->string('duration', 20);
            $table->string('currency', 20);
            $table->string('number_of_user', 20);
            $table->integer('number_of_licence');

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
    }
}
