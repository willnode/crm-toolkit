<?php namespace App\Filters;

use CodeIgniter\Config\Services;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class Auth implements FilterInterface
{
    public function before(RequestInterface $request)
    {
		$request->login = new \App\Models\LoginModel();
		$request->room = explode('/', trim($request->uri->getPath(), '/'))[0];
		// Role Room Precheck
		if ($request->room && !in_array ($request->room, ['login', 'register', 'forgot'], TRUE))
		{
			if (empty($request->login->data) OR $request->login->data->role !== $request->room) {
				$response = Services::response();
				$response->setStatusCode(401);
				if (ENVIRONMENT === DEVELOPMENT) {
					$response->setHeader('WWW-Authenticate', 'Basic realm="'.$request->room.'"');
				}
				return $response->setJSON([
					'status'=>'Error',
					'message' => 'Wrong Authentication'
				]);
			}
		}
    }

    //--------------------------------------------------------------------

    public function after(RequestInterface $request, ResponseInterface $response)
    {
        // Do something here
    }
}