<?php

namespace App\Controllers;

use App\Models\ForgotModel;
use App\Models\LoginModel;
use App\Models\RegisterModel;
use Config\Mimes;

/**
 * This is endpoints to all unaunticated requests.
 * You should also update the Routes.php if
 * you have modified some endpoints here.
 */
class Home extends BaseController
{

	public function index()
	{
		return load_info([
			'routes' => [
				'/login/',
				'/register/',
				'/forgot/',
				'/admin/',
				'/user/'
			],
		]);
	}

	public function login()
	{
		$login = new LoginModel();
		if ($login->data) {
			unset_keys($login->data, [
				'password', 'otp', 'created_at', 'updated_at'
			]);
			return load_ok([
				'login' => $login->data
			]);
		} else {
			return load_401('Wrong Authentication', 'guest');
		}
	}

	public function not_found()
	{
		// Bug, returning response don't send anything.
		sendImmediately(load_404());
	}

	public function forgot()
	{
		if ($this->login->current_id) {
			return (new ForgotModel())->execute($this->login->current_id);
		} else {
			return load_405("Account Not Found");
		}
	}

	public function register()
	{
		return (new RegisterModel())->execute(NULL);
	}

	public function hash($hash)
	{
		echo password_hash($hash, PASSWORD_BCRYPT);
		exit;
	}

	public function uploads($folder, $file)
	{
		$path = WRITEPATH . 'uploads' . DIRECTORY_SEPARATOR . $folder . DIRECTORY_SEPARATOR . $file;
		if (file_exists($path)) {
			$ext = pathinfo($path, PATHINFO_EXTENSION);
			header('Content-Type: ' . (new Mimes())->guessTypeFromExtension($ext));
			echo file_get_contents($path);
			exit;
		} else {
			$this->not_found();
		}
	}



	//--------------------------------------------------------------------

}
