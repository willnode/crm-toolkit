<?php

namespace App\Controllers;

use App\Models\LoginModel;
use App\Models\RegisterModel;
use Config\Database;
use Config\Mimes;

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
		$output = load_404();
		if (is_string($output)) {
			echo $output;
		} else {
			$output->pretend(false)->send();
		}
	}

	public function forgot()
	{
		if ($this->request->getMethod() === POST && $this->login->current_id) {
			$action = $this->request->getPost('action');
			if (!$action) {
				// TODO: If OTP == NULL, send email.
				return load_204("Account Identified");
			} if ($action === 'request') {
				$otp = generate_pin();
				Database::connect()->table('login')
					->where('login_id', $this->login->current_id)
					->update(['otp' => $otp]);
				// TODO: Send email to the user.
				return load_ok('Token sent');
			} else if ($action === 'response') {
				$input_otp = $this->request->getPost('otp');
				$login = get_values_at('login', [
					'login_id' => $this->login->current_id
				], ['otp', 'updated_at']);
				if ((time() - strtotime($login->updated_at)) > 60 * 60 * 24 * 7) {
					return load_404('OTP expired');
				} else if ($input_otp == $login->otp) {
					$input_pw = $this->request->getPost('password');
					if ($input_pw && strlen($input_pw) >= 8) {
						$update = ['password' => $input_pw, 'otp' => NULL];
						control_password_update($update);
						Database::connect()->table('login')
							->where('login_id', $this->login->current_id)
							->update($update);
						return load_ok('Successfully saved');
					} else {
						return load_204('Token correct. Please input new Password.');
					}
				} else {
					return load_405('Incorrect OTP');
				}
			} else {
				load_405();
			}
		} else {
			return load_405();
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
		} else {
			$this->not_found();
		}
		exit;
	}



	//--------------------------------------------------------------------

}
