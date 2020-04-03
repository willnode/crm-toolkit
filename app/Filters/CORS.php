<?php namespace App\Filters;

use CodeIgniter\Config\Services;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class CORS implements FilterInterface
{
    public function before(RequestInterface $request)
    {
        $request = Services::request();
		if (!$request->isAJAX())
			return;
		$frontUrl = $request->config->frontURL;
		if (is_array($frontUrl)) {
			$vary = true;
			if (array_search($request->getHeaderLine('Origin'), $frontUrl)) {
				$frontUrl = $request->getHeaderLine('Origin');
			} else {
				return;
			}
		}
		if ($frontUrl) {
			$response = Services::response();
			$response->setHeader('Access-Control-Allow-Origin', $frontUrl);
			$response->setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
			$response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
			$response->setHeader('Access-Control-Max-Age', '86400');
			if (isset($vary))
				$response->setHeader('Vary', 'Origin');
			if ($request->getMethod() === OPTIONS) {
				return $response;
			}
		}
    }

    //--------------------------------------------------------------------

    public function after(RequestInterface $request, ResponseInterface $response)
    {
        // Do something here
    }
}