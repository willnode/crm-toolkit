<?php namespace App\Models;

class ProfileModel extends BaseModel
{
	protected $table = 'login';
	protected $primaryKey = 'login_id';
	protected $select = [
		'login_id', 'username',	'email', 'name', 'avatar', 'role',
	];
	protected $allowedFields = [
		'name', 'email', 'avatar', 'password'
	];
	protected $fileUploadRules = [
		'avatar' => ['types' => ['jpg', 'jpeg', 'png', 'bmp']]
	];
	protected $validationRules = [
		'name' => 'required|min[3]',
		'email' => 'required|valid_email'
	];

	protected function executeBeforeExecute($event)
	{
		if ($event['method'] === DELETE)
			$event['response'] = load_405();
		return $event;
	}

	protected function executeBeforeChange($event)
	{
		extract($event, EXTR_REFS);

		// Password Change
		if ($method !== DELETE AND !empty($data['password'])) {
			if(control_password_update($data)) {
				$data['otp'] = NULL;
			}
		}
		return $event;
	}
}