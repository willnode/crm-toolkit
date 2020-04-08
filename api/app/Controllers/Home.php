<?php namespace App\Controllers;

use App\Models\LoginModel;
use Config\Mimes;

class Home extends BaseController
{

	public function index()
	{
		return load_info([
			'routes'=>[
				'/login/',
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

	public function hash($hash)
	{
	    echo password_hash($hash, PASSWORD_BCRYPT);
	    exit;
	}

	public function uploads($folder, $file)
	{
		$path = WRITEPATH.'uploads'.DIRECTORY_SEPARATOR.$folder.DIRECTORY_SEPARATOR.$file;
		if (file_exists($path)) {
			$ext = pathinfo($path, PATHINFO_EXTENSION);
			header('Content-Type: '.(new Mimes())->guessTypeFromExtension($ext));
			echo file_get_contents($path);
		} else {
			$this->not_found();
		}
		exit;
	}



	//--------------------------------------------------------------------

}
