<?php namespace App\Controllers;

use App\Models\ProfileModel;

class User extends BaseController
{
	const ROLE = 'user';

	public function index()
	{
		return load_info([
			'routes'=>[
				'/user/profile/',
			],
		]);
	}

	public function profile()
	{
		return (new ProfileModel())->execute($this->login->current_id);
	}
}