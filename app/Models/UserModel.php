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
		'avatar' => ['types' => ['jpg', 'jpeg', 'png', 'bmp']]
	];
	protected $validationRules = [
		'name' => 'required|min_length[3]|alpha_numeric_space',
		'email' => 'required|valid_email',
		'username' => 'required|min_length[3]|alpha_numeric'
	];

	function executeBeforeExecute($event)
	{
		$event['builder']->where('role', 'user');
		return $event;
	}

	function executeAfterChange($event)
	{
		extract($event, EXTR_REFS);
		if ($method !== DELETE) {
			$otps = get_post_updates(['otp_invoke', 'otp_revoke']);
			if (!empty($otps)) {
				if (isset($otps['otp_invoke'])) {
					$otp = generate_pin();
				} else if (isset($otps['otp_revoke'])) {
					$otp = NULL;
				}
				$this->db->table($this->table)
					->update(
						['otp' => $otp],
						[$this->primaryKey => $id]);
			}
		}
		return $event;
	}
}