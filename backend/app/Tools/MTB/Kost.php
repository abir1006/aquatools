<?php

namespace App\Tools\MTB;

use App\Modules\PrisModule;

class Kost
{
    public static function c36()
    {
        return (self::c25() + self::c30()) / NRS::c10(new PrisModule());
    }

    public static function c25()
    {
        return 759205;
    }

    public static function c30()
    {
        return 361680;
    }

    public static function c27()
    {
        return 30294;
    }
}
