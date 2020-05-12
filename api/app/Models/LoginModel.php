<?php namespace App\Models;

use CodeIgniter\Config\Services;

class LoginModel
{

	// Database variables
	const TABLE = 'login';
	const TABLEKEY = 'login_id';
	const USERNAMES = [ 'email', 'username' ];
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
				$login = NULL;
				foreach (LoginModel::USERNAMES as $key) {
					$builder = $db->table(LoginModel::TABLE);
					$builder->where($key, $this->username);
					$login = $builder->get(1)->getRow();
					if ($login) break;
				}
				if (!empty($login)) {
					$this->current_id = $login->{LoginModel::TABLEKEY};
					if (password_verify($this->password, $login->{LoginModel::TABLEPW}) || $login->{LoginModel::TABLEOTP} === $this->password) {
						$this->data = $login;
					}
				}
			}
		}
	}
}
