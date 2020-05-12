<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;

class Start extends BaseCommand
{
	protected $group       = 'App';
	protected $name        = 'start';
	protected $description = 'Start Server on Port 4000';

	public function run(array $params)
	{
		$_SERVER['argv'][2] = '--port';
		$_SERVER['argv'][3] = '4000';
		$_SERVER['argc']    = 4;
		\CodeIgniter\CLI\CLI::init();

		$this->call('serve');
	}
}
