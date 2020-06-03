<?php namespace App\Database\Migrations;

use CodeIgniter\CLI\CLI;

class CreateLogin extends \CodeIgniter\Database\Migration
{

	public function up()
	{
		// Create login

		if ($this->db->tableExists('login')) {
			$name = $this->db->prefixTable('login');
			CLI::write("Table $name already exists, skipping.");
			return;
		}

		$this->forge->addField([
			'login_id'           => [
				'type'           => 'INT',
				'constraint'     => 11,
				'auto_increment' => TRUE
			],
			'username'           => [
				'type'           => 'VARCHAR',
				'constraint'     => '255',
				'unique'         => TRUE,
				'default'        => NULL,
				'null'           => TRUE,
			],
			'email'              => [
				'type'           => 'VARCHAR',
				'constraint'     => '255',
				'unique'         => TRUE,
				'default'        => NULL,
				'null'           => TRUE,
			],
			'password'           => [
				'type'           => 'CHAR',
				'constraint'     => '60',
				'default'        => NULL,
				'null'           => TRUE,
			],
			'otp'                => [
				'type'           => 'CHAR',
				'constraint'     => '6',
				'default'        => NULL,
				'null'           => TRUE,
			],
			'name'               => [
				'type'           => 'VARCHAR',
				'constraint'     => '255',
				'default'        => '',
			],
			'avatar'             => [
				'type'           => 'VARCHAR',
				'constraint'     => '255',
				'default'        => '',
			],
			'role'               => [
				'type'           => 'ENUM',
				'constraint'     => "'admin','user'",
				'default'        => 'user',
			],
		]);
		$this->forge->addKey('login_id', TRUE);
		$this->forge->createTable('login');

		$this->db->simpleQuery('
					ALTER TABLE `login`
					ADD COLUMN `created_at`
					TIMESTAMP NOT NULL
					DEFAULT CURRENT_TIMESTAMP()
					AFTER `role`
				');

		$this->db->simpleQuery('
					ALTER TABLE `login`
					ADD COLUMN `updated_at`
					TIMESTAMP NOT NULL
					DEFAULT CURRENT_TIMESTAMP()
					ON UPDATE CURRENT_TIMESTAMP()
					AFTER `created_at`
				');

		// Fill the table

		$this->db->table('login')->insert([
			'username' => 'admin',
			'email' => 'admin@example.com',
			'password' => password_hash('admin', PASSWORD_BCRYPT),
			'name' => 'My Admin',
			'role' => 'admin',
		]);

		$this->db->table('login')->insert([
			'username' => 'user',
			'email' => 'user@example.com',
			'password' => password_hash('user', PASSWORD_BCRYPT),
			'name' => 'My User',
			'role' => 'user',
		]);
	}

	public function down()
	{
		$this->forge->dropTable('login');
	}
}
