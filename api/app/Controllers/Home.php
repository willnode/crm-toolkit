<?php namespace App\Controllers;

use App\Models\LoginModel;

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

	public function notFound()
	{
		return load_404();
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

	//--------------------------------------------------------------------

}
