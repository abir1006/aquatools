<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToTableMaterialsResources extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('materials_resources', function (Blueprint $table) {
            $table->string('caption')->nullable();
            $table->text('excerpt')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('materials_resources', function (Blueprint $table) {
            $table->dropColumn(['caption', 'excerpt']);
        });
    }
}
