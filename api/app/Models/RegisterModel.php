<?php namespace App\Models;

class RegisterModel extends BaseModel
{
	protected $table = 'login';
	protected $primaryKey = 'login_id';
	protected $allowedFields = [
		'name', 'email', 'password'
	];
	protected $validationRules = [
		'name' => 'required|min_length[3]|alpha_numeric_space',
		'email' => 'required|valid_email',
		'password' => 'required|min_length[8]',
	];

	function executeBeforeExecute($event)
	{
		if ($event['method'] !== POST) {
			$event['response'] = load_405();
		}
		return $event;
	}

	protected function executeBeforeChange($event)
	{
		extract($event, EXTR_REFS);

		control_password_update($data);

		return $event;
	}
}