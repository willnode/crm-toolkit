<?php namespace App\Models;

use CodeIgniter\Config\Services;

class LoginModel
{

	// Database variables
	const TABLE = 'login';
	const TABLEKEY = 'login_id';
	const USERNAMES = [ 'username', 'email' ];
	const TABLEPW = 'password';
	const TABLEOTP = 'otp';

	// -------------------------------------

	public $username;

	public $password;

	public $current_id;

	public $data;

	public function __construct() {
		// Get authentication
		$request = Services::request();
		if ($request->hasHeader('Authorization')) {
			$nonce = base64_decode(substr($request->getHeader('Authorization')->getValue(), 6), true);
			if ($nonce AND count($nonce = explode(':', $nonce, 2)) === 2) {
				$this->username = $nonce[0];
				$this->password = $nonce[1];
				$db  = \Config\Database::connect();
				$builder = $db->table(LoginModel::TABLE);
				foreach (LoginModel::USERNAMES as $key) {
					$builder->orWhere($key, $this->username);
				}
				$login = $builder->get(1)->getRow();
				if (!empty($login)) {
					if (password_verify($this->password, $login->{LoginModel::TABLEPW}) || $login->{LoginModel::TABLEOTP} === $this->password) {
						$this->data = $login;
						$this->current_id = $this->data->{LoginModel::TABLEKEY};
					}
				}
			}
		}
	}
}
