<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;


class Install extends BaseCommand
{
	protected $group       = 'App';
	protected $name        = 'install';
	protected $description = 'Install Database (MySql) and Run Migrations';

	public function run(array $params)
	{
		// test connection
		$db = Database::connect();
		try {
			$db->connect();
			mysqli_connect(
				$db->hostname,
				$db->username,
				$db->password
			);
			CLI::write('Database connected! Running migrations...');
		} catch (\Throwable $th) {
			CLI::write('Creating database because it\'s not exist...');
			try {
				$conn = mysqli_connect(
					$db->hostname,
					$db->username,
					$db->password
				);
				$conn->query("CREATE DATABASE $db->database" .
					" CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci");
				$conn->query("USE $db->database");
				CLI::write('Database created! Running migrations...');
			} catch (\Throwable $th) {
				CLI::error(CLI::color('Cannot create database!' .
					' Did your database server running?', 'red'));
			}
		} finally {
			$this->call('migrate');
		}
	}
}
