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
		$request->room = explode('/', $request->getServer('REQUEST_URI'))[1];
		// Role Room Precheck
		//if ($request->room)
		{
			if (empty($request->login->data) OR $request->login->data->role !== $request->room) {
				$response = Services::response();
				$response->setStatusCode(401);
				Services::response()->setHeader('WWW-Authenticate', 'Basic realm="'.$request->room.'"');
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