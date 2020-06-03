<?php namespace App\Controllers;

use App\Models\ProfileModel;
use App\Models\UserModel;

class Admin extends BaseController
{
	public function index()
	{
		return load_info([
			'routes'=>[
				'/admin/user/',
				'/admin/profile/',
			],
		]);
	}

	public function profile()
	{
		return (new ProfileModel())->execute($this->login->current_id);
	}

	public function user($id = NULL)
	{
		return (new UserModel())->execute($id);
	}
}