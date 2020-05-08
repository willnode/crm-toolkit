<?php namespace App\Models;

class UserModel extends BaseModel
{
	protected $table = 'login';
	protected $primaryKey = 'login_id';
	protected $select = [
		'login_id', 'username',	'email', 'name', 'avatar', 'otp',
	];
	protected $searchable = [
		'username', 'email', 'name'
	];
	protected $allowedFields = [
		'name', 'email', 'avatar', 'username'
	];
	protected $fileUploadRules = [
		'avatar' => ['types' => ['jpg', 'png', 'bmp']]
	];
	protected $validationRules = [
		'name' => 'required|min_length[3]|alpha_numeric_space',
		'email' => 'required|valid_email',
	];
	protected $where = [
		'role' => 'user',
	];

	function executeBeforeChange($event)
	{
		extract($event, EXTR_REFS);
		if ($method === CREATE || $action === 'otp_invoke') {
			$data['otp'] = generate_pin();
		} else if ($action === 'otp_revoke') {
			$data['otp'] = NULL;
		}
		return $event;
	}
}