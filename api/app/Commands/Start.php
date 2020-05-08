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
		$this->call('serve', ['-port', '4000']);
	}
}
