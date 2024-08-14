<?php

namespace App\Console\Commands;


use App\Tools\MTB\MTBArrayOutput;
use Illuminate\Console\Command;
use App\Tools\MTB\NRS;


class ToolsMTB extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tools:MTB';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        NRS::setInputs();

        $output = NRS::calculateOutput(new MTBArrayOutput());

        print_r($output);
        exit;
    }
}
