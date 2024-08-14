<?php

namespace App\Tools\Modules\bPLM_EM;

use App\Tools\Vaccine\Oppdretter;
use App\Tools\Optimization\Oppdretter as OptimizationOppdretter;

class BPLM
{
    public static $snittvekt;
    public static $antall_utsatt;
    public static $vf3;
    public static $slaktevekt_rund_sup;
    public static $dead_percentage;
    public static $dead_vekt_kg;
    public static $prevalens_percentage;
    public static $dogngrader;
    public static $bfcr;
    public static $konv_faktor;
    public static $slaktevekt;
    public static $ord_percentage;
    public static $ord_vekt_kg;
    public static $prod_percentage;
    public static $prod_vekt_kg;
    public static $utkast_percentage;
    public static $utkast_vekt_kg;
    public static $model_name;

    public static $ekstraordinare_kostnader_NOK_1000 = 1000;
    public static $behandlingskostnader_NOK_1000 = 500;
    public static $forebyggingskostnader_NOK_1000 = 400;

    public static $case1Inputs = [];

    private static $case_no;

    public static $opt_gen_models = ['Optimization', 'Genetics'];

    private static $slakt_vekt_kg_value = [];

    private static $basic_cv;

    private static $improved_cv;

    public static function setInputs(
        $model_name = 'Feed',
        $snittvekt = 0,
        $antall_utsatt = 0,
        $prevalens_percentage = 0,
        $dogngrader = 0,
        $vf3 = 0,
        $slaktevekt = 0,
        $dead_percentage = 0,
        $dead_vekt_kg = 0,
        $bfcr = 0,
        $konv_faktor = 0,
        $ord_percentage = 0,
        $ord_vekt_kg = 0,
        $prod_percentage = 0,
        $prod_vekt_kg = 0,
        $utkast_percentage = 0,
        $utkast_vekt_kg = 0,
        $case_no = 1,
        $basic_cv = 22,
        $improved_cv = 0
    )
    {
        //logger(get_defined_vars());
        self::$model_name = $model_name;
        self::$snittvekt = $snittvekt;
        self::$antall_utsatt = $antall_utsatt;
        self::$prevalens_percentage = $prevalens_percentage;
        self::$dogngrader = $dogngrader;
        self::$vf3 = $vf3;
        self::$slaktevekt = $slaktevekt;
        self::$dead_percentage = $dead_percentage;
        self::$dead_vekt_kg = $dead_vekt_kg;
        self::$bfcr = $bfcr;
        self::$konv_faktor = $konv_faktor;
        self::$ord_percentage = $ord_percentage;
        self::$ord_vekt_kg = $ord_vekt_kg;
        self::$prod_percentage = $prod_percentage;
        self::$prod_vekt_kg = $prod_vekt_kg;
        self::$utkast_percentage = $utkast_percentage;
        self::$utkast_vekt_kg = $utkast_vekt_kg;
        self::$case_no = $case_no;
        self::$basic_cv = $basic_cv;
        self::$improved_cv = $improved_cv;
    }

    public static function caseNo()
    {
        return self::$case_no;
    }

    public static function testMethods()
    {
        $result = [];
        $class_methods = get_class_methods(self::class);
        foreach ($class_methods as $method_name) {
            if (in_array($method_name, ['testMethods', 'setInputs', 'getCasesValue', 'getCasesValueWithPrevalens'])) {
                continue;
            }

            $result[$method_name] = self::$method_name();
        }
        return $result;
    }

    public static function currentModel()
    {
        return self::$model_name;
    }

    // Cell D3
    public static function smoltvektKg()
    {
        $value = self::$snittvekt / 1000;

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::getCasesValue($value, __FUNCTION__);
        }

        return $value;
    }

    // Cell D4
    public static function antallUtsatt()
    {
        return self::$antall_utsatt;
    }

    // Cell D5
    public static function antallSlaktet()
    {
        return self::$antall_utsatt - (self::deadPercentage() * self::$antall_utsatt);
    }

    // Cell D6
    public static function percentageSlaktet()
    {
        return self::$antall_utsatt == 0 ? 0 : self::antallSlaktet() / self::$antall_utsatt;
    }

    // Cell D7
    public static function percentageKvalitet()
    {
        return self::supPercentage() + self::ordPercentage() + self::prodPercentage() + self::utkastPercentage();
    }

    public static function prevalens()
    {
        return self::$prevalens_percentage / 100;
    }

    // for optimizatin model. common function
    public static function getCasesValue($value, $functionName)
    {
        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            $caseNo = self::caseNo();
            self::$case1Inputs[$functionName][$caseNo] = $value;
            // For genetics, return always same in all cases
            if ('Genetics' == self::currentModel()) {
                return self::$case1Inputs[$functionName][1];
            }
            return $caseNo == 1 ? $value : self::$case1Inputs[$functionName][1] + $value;
        }
    }

    public static function getCasesValueWithPrevalens($value, $functionName)
    {
        $caseNo = self::caseNo();
        self::$case1Inputs[$functionName][$caseNo] = $value;
        return $caseNo == 1 ? $value : (self::$case1Inputs[$functionName][1] + ($value * self::prevalens()));
    }

    // end common function

    public static function dongngrader()
    {
        $value = self::$dogngrader;

        return $value;
    }

    public static function vf3()
    {
        $value = self::$vf3;

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::getCasesValue($value, __FUNCTION__);
        }

        return $value;
    }


    // Cell D11
    public static function slaktevektRundSupVF3()
    {
        $handle_power_negative_value = 1;

        $smolt_vekt_kg = self::smoltvektKg();

        if ($smolt_vekt_kg < 0) {
            // convert negative value into positive before send pow method
            $smolt_vekt_kg = abs($smolt_vekt_kg);
            $handle_power_negative_value = -1;
        }

        if (self::currentModel() == 'Vaccine') {
            return 0;
        }

        // Pass abs value to square root and then multiply with negative
        $square_root_value = $handle_power_negative_value * pow($smolt_vekt_kg * 1000, 1 / 3);

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return (pow($square_root_value + self::vf3() / 1000 * self::dongngrader(), 3)) / 1000;
        }

        return (pow($square_root_value + self::$vf3 / 1000 * self::$dogngrader, 3)) / 1000;
    }

    public static function COD()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::sjukdom_redusert_slaktevekt_kg();
        }
    }


    public static function tilvekstRpp()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::vaksine_tilvekst_kg_rpp();
        }
    }


    public static function slaktevektRundSupEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::sjukdom_sannsynlighet_for_sjukdom() * self::COD() * (1 - Oppdretter::vaksine_tilvekst_kg_rpp());
        }
    }

    public static function deathEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::sjukdom_sannsynlighet_for_sjukdom() * Oppdretter::sjukdom_kt_ddelighet_prosentpoeng() * (1 - Oppdretter::vaksine_ddelighet_poeng_rpp());
        }
    }

    public static function OrdVektEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return self::slaktevektRundSupEffectRev();
        }
    }

    public static function prodPercentangeEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::sjukdom_sannsynlighet_for_sjukdom() * Oppdretter::sjukdom_kt_nedklassing_prod_kvalitet() * (1 - Oppdretter::vaksine_produksjon_poeng_rpp());
        }
    }

    public static function utkastPercentangeEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::sjukdom_sannsynlighet_for_sjukdom() * Oppdretter::sjukdom_utkast_percentange() * (1 - Oppdretter::vaksine_utkast_poeng_rpp());
        }
    }

    public static function UtkastVektEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return self::slaktevektRundSupEffectRev();
        }
    }

    public static function bFcrEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::sjukdom_sannsynlighet_for_sjukdom() * Oppdretter::sjukdom_kt_bfcr() * (1 - Oppdretter::vaksine_bfcr_enhet_rpp());
        }
    }

    public static function cvEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::sjukdom_sannsynlighet_for_sjukdom() * Oppdretter::sjukdom_kt_cv() * (1 - Oppdretter::vaksine_cv_rpp());
        }
    }


    public static function ekstraordinreKostnaderNokMillEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            $case2Value = Oppdretter::sjukdom_ekstraordinre_kostnader_nok_mill() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom();
            return $case2Value * (1 - Oppdretter::vaksine_ekstraordinre_kostnader_rpp());
        }
    }

    public static function behandlingskostnadNokMillEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            $case2Value = Oppdretter::sjukdom_behandlingskostnad_nok_mill() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom();
            return $case2Value * (1 - Oppdretter::vaksine_behandling_rpp());
        }
    }

    public static function forebygginskostnadNokMillEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            $case2Value = Oppdretter::sjukdom_forebygginskostnad_nok_mill() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom();
            return $case2Value * (1 - Oppdretter::vaksine_forebygging_rpp());
        }
    }


    public static function deadVektKgEffectRev()
    {
        if (self::currentModel() == 'Vaccine') {
            $deathEffectRev = self::deathEffectRev();
            $deadpcase1 = Oppdretter::budsjett_ddelighet_budsjett_percentage();
            $deadVektCase1 = Oppdretter::budsjett_snittvekt_ddfisk_kg();
            $deadVektCase2 = Oppdretter::sjukdom_vekt_pa_ddfisk();
            $part1 = ($deadpcase1 + $deathEffectRev) == 0 ? 0 : $deadVektCase1 * ($deadpcase1 / ($deadpcase1 + $deathEffectRev));
            $part2 = (($deadpcase1 + $deathEffectRev)) == 0 ? 0 : $deadVektCase2 * $deathEffectRev / (($deadpcase1 + $deathEffectRev));
            return $part1 + $part2;
        }
    }

    // Cell D12
    public static function slaktevektRundSup()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::budsjett_slaktevekt_rund_kg();
            return Oppdretter::caseNo() > 2 ? $input + self::slaktevektRundSupEffectRev() + Oppdretter::vaksine_tilvekst_kg_bi_effekt() : (Oppdretter::caseNo() == 2 ? $input + (self::COD() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom()) : $input);
        }

        if ('Optimization' == self::currentModel()) {
            return self::slaktevektRundSupVF3();
        }

        if ('Genetics' == self::currentModel()) {
            self::$slakt_vekt_kg_value[self::caseNo()] = self::$prod_vekt_kg;
            return self::caseNo() == 1 ? self::$prod_vekt_kg : self::$slakt_vekt_kg_value[1] + (self::prevalens() * self::$prod_vekt_kg);
        }

        return self::$slaktevekt / 1000;
    }

    // Cell D13
    public static function deadPercentageInput()
    {
        return self::$dead_percentage / 100;
    }

    public static function deadPercentage()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::budsjett_ddelighet_budsjett_percentage();
            if (Oppdretter::caseNo() > 2) {
                return $input + self::deathEffectRev() + Oppdretter::vaksine_ddelighet_poeng_bi_effekt();
            } elseif (Oppdretter::caseNo() == 2) {
                return $input + (Oppdretter::sjukdom_kt_ddelighet_prosentpoeng() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom());
            } else {
                return $input;
            }
        }

        $value = self::deadPercentageInput();

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::getCasesValueWithPrevalens($value, __FUNCTION__);
        }

        return $value;
    }

    // Cell D14
    // Changed after discussed with Paul & Tomal bhai
    public static function deadVektKg()
    {
        // for vaccine & COD
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::budsjett_snittvekt_ddfisk_kg();
            if (Oppdretter::caseNo() == 1) {
                return $input;
            } elseif (Oppdretter::caseNo() == 2) {
                $deadp = self::deadPercentage();
                $part1 = $deadp == 0 ? 0 : $input * (Oppdretter::budsjett_ddelighet_budsjett_percentage() / $deadp);
                $part2 = $deadp == 0 ? 0 : Oppdretter::sjukdom_vekt_pa_ddfisk() * ((Oppdretter::sjukdom_kt_ddelighet_prosentpoeng() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom()) / $deadp);
                return $part1 + $part2;
            } else {
                return self::deadVektKgEffectRev();
            }
        }

        // For Optimization & Genetics
        return self::getCasesValueWithPrevalens(self::$dead_vekt_kg, __FUNCTION__);
    }

//    public static function deadVektKg()
//    {
//        //for vaccine & COD
//        if (self::currentModel() == 'Vaccine') {
//            $input = Oppdretter::budsjett_snittvekt_ddfisk_kg();
//            if (Oppdretter::caseNo() == 1) {
//                return $input;
//            } elseif (Oppdretter::caseNo() == 2) {
//                $deadp = self::deadPercentage();
//                $part1 = $deadp == 0 ? 0 : $input * (Oppdretter::budsjett_ddelighet_budsjett_percentage() / $deadp);
//                $part2 = $deadp == 0 ? 0 : Oppdretter::sjukdom_vekt_pa_ddfisk(
//                    ) * ((Oppdretter::sjukdom_kt_ddelighet_prosentpoeng(
//                            ) * Oppdretter::sjukdom_sannsynlighet_for_sjukdom()) / $deadp);
//                return $part1 + $part2;
//            } else {
//                return self::deadVektKgEffectRev();
//            }
//        }
//
//        $value = self::$dead_vekt_kg;
//
//        if (in_array(self::currentModel(), self::$opt_gen_models)) {
//            $caseNo = self::caseNo();
//            self::$case1Inputs[__FUNCTION__][$caseNo] = $value;
//
//            if (self::caseNo() == 1) {
//                return $value;
//            } else {
//                $deadp = self::deadPercentage();
//                $part1 = $deadp == 0 ? 0 : self::$case1Inputs[__FUNCTION__][1] * (self::$case1Inputs['deadPercentage'][1] / $deadp);
//                $part2 = $deadp == 0 ? 0 : $value * ((self::deadPercentageInput() * self::prevalens()) / $deadp);
//                return $part1 + $part2;
//            }
//        }
//
//        // Paul suggested deadvektkg in case2
//        //   if (in_array(self::currentModel(), self::$opt_gen_models)) {
//        //       return self::getCasesValueWithPrevalens($value, __FUNCTION__);
//        //   }
//
//        return $value;
//    }

    // Cell D15
    public static function supPercentage()
    {
        return 1 - self::ordPercentage() - self::prodPercentage() - self::utkastPercentage();
    }

    // Cell D16
    public static function ordPercentage()
    {
        $value = self::$ord_percentage / 100;

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::getCasesValueWithPrevalens($value, __FUNCTION__);
        }

        return $value;
    }

    // Cell D17
    public static function ordVektkg()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::caseNo() < 3 ? self::slaktevektRundSup() : Oppdretter::budsjett_slaktevekt_rund_kg() + self::OrdVektEffectRev();
        }

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::slaktevektRundSup();
        }

        return self::$ord_vekt_kg;
    }

    // Cell D18
    public static function prodPercentage()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::budsjett_nedklassing_prod_percentage();
            return Oppdretter::caseNo() > 2 ? $input + self::prodPercentangeEffectRev() + Oppdretter::vaksine_produksjon_poeng_bi_effekt() : (Oppdretter::caseNo() == 2 ? $input + (Oppdretter::sjukdom_kt_nedklassing_prod_kvalitet() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom()) : $input);
        }

        $value = self::$prod_percentage / 100;

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::getCasesValueWithPrevalens($value, __FUNCTION__);
        }

        return $value;
    }

    // Cell D19
    public static function prodVektKg()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::caseNo() < 3 ? self::slaktevektRundSup() : Oppdretter::budsjett_slaktevekt_rund_kg() + self::OrdVektEffectRev();
        }

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::slaktevektRundSup();
        }

        return self::$prod_vekt_kg;
    }

    // Cell D20
    public static function utkastPercentage()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::budsjett_utkast_percentange();
            return Oppdretter::caseNo() > 2 ? $input + self::utkastPercentangeEffectRev() + Oppdretter::vaksine_utkast_poeng_bi_effekt() : (Oppdretter::caseNo() == 2 ? $input + (Oppdretter::sjukdom_utkast_percentange() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom()) : $input);
        }

        $value = self::$utkast_percentage / 100;

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::getCasesValueWithPrevalens($value, __FUNCTION__);
        }

        return $value;
    }

    // Cell D21
    public static function utkastVektKg()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::caseNo() < 3 ? self::slaktevektRundSup() : Oppdretter::budsjett_slaktevekt_rund_kg() + self::UtkastVektEffectRev();
        }

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::slaktevektRundSup();
        }

        return self::$utkast_vekt_kg;
    }

    public static function bFcr()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::budsjett_bfcr();
            return Oppdretter::caseNo() > 2 ? $input + self::bFcrEffectRev() + Oppdretter::vaksine_bfcr_enhet_bi_effekt() : (Oppdretter::caseNo() == 2 ? $input + (Oppdretter::sjukdom_kt_bfcr() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom()) : $input);
        }

        $value = self::$bfcr;

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::getCasesValueWithPrevalens($value, __FUNCTION__);
        }
    }

    public static function cv()
    {
        $input = Oppdretter::budsjett_cv();
        if (self::currentModel() == 'Vaccine') {
            if (Oppdretter::caseNo() > 2) {
                return $input + self::cvEffectRev() + Oppdretter::vaksine_cv_bi_effekt();
            } elseif (Oppdretter::caseNo() == 2) {
                return $input + (Oppdretter::sjukdom_kt_cv() * Oppdretter::sjukdom_sannsynlighet_for_sjukdom());
            } else {
                return $input;
            }
        }

        // Optimization & Genetics model
        $cv_output = self::$basic_cv;
        if (self::caseNo() >= 2) {
            $cv_output =  $cv_output + (self::$improved_cv * self::prevalens());
        }

        return $cv_output;
    }

    // Cell D23
    public static function konvFaktor()
    {
        if (self::currentModel() == 'Vaccine') {
            return Oppdretter::budsjett_omregningsfaktor_rund_slyd();
        }

        if ('Optimization' == self::currentModel()) {
            return OptimizationOppdretter::getOmregningsfaktorRundSlyd();
        }

        return self::$konv_faktor;
    }

    // Cell D24
    public static function ekstraordinreKostnaderNok1000()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::sjukdom_ekstraordinre_kostnader_nok_mill();
            return Oppdretter::caseNo() > 2 ? self::ekstraordinreKostnaderNokMillEffectRev() : (Oppdretter::caseNo() == 2 ? $input * Oppdretter::sjukdom_sannsynlighet_for_sjukdom() : 0);
        }
        return 0;
    }

    // Cell D25
    public static function behandlingskostnadNok1000()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::sjukdom_behandlingskostnad_nok_mill();
            return Oppdretter::caseNo() > 2 ? self::behandlingskostnadNokMillEffectRev() : (Oppdretter::caseNo() == 2 ? $input * Oppdretter::sjukdom_sannsynlighet_for_sjukdom() : 0);
        }
        return 0;
    }

    // Cell D26
    public static function forebygginskostnadNok1000()
    {
        if (self::currentModel() == 'Vaccine') {
            $input = Oppdretter::sjukdom_forebygginskostnad_nok_mill();
            return Oppdretter::caseNo() > 2 ? self::forebygginskostnadNokMillEffectRev() : (Oppdretter::caseNo() == 2 ? $input * Oppdretter::sjukdom_sannsynlighet_for_sjukdom() : 0);
        }
        return 0;
    }

    // Cell D28
    // Formula = (D5*D15*D12)+(D5*D16*D17)+(D5*D18*D19)+(D4*D20*D21)
    public static function innkjortBiomasseRundKg()
    {
        if (self::currentModel() == 'Vaccine') {
            $part1 = self::antallSlaktet() * self::supPercentage() * self::slaktevektRundSup();
            $part2 = self::antallSlaktet() * self::ordPercentage() * self::ordVektkg();
            $part3 = self::antallSlaktet() * self::prodPercentage() * self::prodVektKg();
            $part4 = self::antallSlaktet() * self::utkastPercentage() * self::utkastVektKg();
            return $part1 + $part2 + $part3 + $part4;
        }


        $part1 = self::antallSlaktet() * self::supPercentage() * self::slaktevektRundSup();
        $part2 = self::antallSlaktet() * self::ordPercentage() * self::ordVektkg();
        $part3 = self::antallSlaktet() * self::prodPercentage() * self::prodVektKg();
        $part4 = self::antallSlaktet() * self::utkastPercentage() * self::utkastVektKg(); // antallSlaktet Correction
        return $part1 + $part2 + $part3 + $part4;
    }


    // Cell D29
    // Formula = (D5*D15*D12)+(D5*D16*D17)+(D5*D18*D19)
    public static function solgtBiomasseRundVektKg()
    {
        $part1 = self::antallSlaktet() * self::supPercentage() * self::slaktevektRundSup();
        $part2 = self::antallSlaktet() * self::ordPercentage() * self::ordVektkg();
        $part3 = self::antallSlaktet() * self::prodPercentage() * self::prodVektKg();
        return $part1 + $part2 + $part3;
    }

    // Cell D30
    public static function smoltBiomasseKg()
    {
        return self::smoltvektKg() * self::antallUtsatt();
    }

    // Cell D31
    public static function deadBiomasseKg()
    {
        return self::antallUtsatt() * self::deadPercentage() * self::deadVektKg();
    }

    // Cell D32
    public static function deadAntall()
    {
        return self::antallUtsatt() * self::deadPercentage();
    }

    // Cell D33
    public static function utkastBiomasseKg()
    {
        return self::antallSlaktet() * self::utkastPercentage() * self::utkastVektKg();
    }

    // Cell D34
    public static function produsertBiomasseKg()
    {
        return self::solgtBiomasseRundVektKg() - self::smoltBiomasseKg() + self::deadBiomasseKg() + self::utkastBiomasseKg();
    }

    // Cell D35
    public static function feedVolumKg()
    {
        if (self::currentModel() == 'Vaccine') {
            return self::bFcr() * self::produsertBiomasseKg();
        }

        if (in_array(self::currentModel(), self::$opt_gen_models)) {
            return self::produsertBiomasseKg() * self::bFcr();
        }

        return self::produsertBiomasseKg() * self::$bfcr;
    }

    // Cell D36
    public static function slaktevektHOGKg()
    {
        return self::slaktevektRundSup() * self::konvFaktor(); // updated for common
    }

    // Cell D37
    public static function sogtAntall()
    {
        return self::antallSlaktet() - (self::antallSlaktet() * self::utkastPercentage());
    }

    // Cell D38
    public static function solgtBiomasseTotHOGKg()
    {
        return self::solgtBiomasseRundVektKg() * self::konvFaktor(); // updated for common
    }

    // Cell D39
    public static function solgtBiomasseSupHOGKg()
    {
        return self::antallSlaktet() * self::supPercentage() * self::slaktevektRundSup() * self::konvFaktor(); // updated for common
    }

    // Cell D40
    public static function solgtBiomasseOrdHOGKg()
    {
        return self::antallSlaktet() * self::ordPercentage() * self::ordVektkg() * self::konvFaktor(); // updated for common
    }

    // Cell D41
    public static function solgtBiomasseProdHOGKg()
    {
        return self::antallSlaktet() * self::prodPercentage() * self::prodVektKg() * self::konvFaktor(); // updated for common
    }
}
