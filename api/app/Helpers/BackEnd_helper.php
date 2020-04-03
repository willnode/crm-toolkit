<?php

use CodeIgniter\Config\Services;
use CodeIgniter\Files\Exceptions\FileException;
use Config\Database;

function generate_pin () {
	return random_int(111111, 999999);
}

function unset_keys(&$data, $keys) {
	foreach ($keys as $key) {
		unset($data->{$key});
	}
}

function set_cors_headers() {
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
	}
}


/**
 * Quick way to get POST values in assosicate array
 */
function get_post_updates($vars = [], $default = []) {
	$request = Services::request();
	$updates = $default;
	foreach ($vars as $var) {
		if (($val = $request->getPost($var)) !== null) {
			$updates[$var] = $val;
		}
	}
	return $updates;
}

/**
 * Handle file removal easily
 */
function control_file_delete($folder, $existing_value = '')
{
	$existing_file = WRITEPATH."uploads/$folder/$existing_value";
	if (is_file($existing_file)) {
		unlink($existing_file);
	}
}

/**
 * Handle file upload on POST, and also delete existing file in previous data (so no orphan files).
 * $attr => ['folder', 'types', 'required', 'custom_file_name' ]
 */
function control_file_upload(&$updates, $name, $attr, $existing_row = NULL)
{
	$folder = $attr['folder'] ?? $name; // REQUIRED
	$types = $attr['types'] ?? '*';
	$required = $attr['required'] ?? FALSE;
	$overwrite = $attr['overwrite'] ?? FALSE;
	$custom_file_name = $attr['custom_file_name'] ?? NULL;
	$request = Services::request();
	$file = $request->getFile($name);
	if ($file !== NULL) {
		if (!$file->isValid()) {
			throw new FileException('File seems not valid');
		}
		$full_folder = WRITEPATH."uploads/$folder/";
		if (!is_dir($full_folder)) {
            mkdir($full_folder, 0777, true);
		} else if (!empty($existing_row->{$name})) {
			control_file_delete($folder, $existing_row->{$name});
		}
		if (is_array($types) AND array_search($file->guessExtension(), $types) === -1) {
			throw new FileException('Bad file type');
		}
		$filename = is_callable($custom_file_name) ?
			$custom_file_name($file) : $file->getFilename();
		if(!$file->move(WRITEPATH.'uploads', $filename, $overwrite)) {
			throw new FileException('Failed to move uploaded file');
		}
		$updates[$name] = $file->getName();
		return TRUE;
	} elseif ($request->getPost($name.'_delete') && !$required) {
		$updates[$name] = '';
		if (!empty($existing_row->{$name}))
			control_file_delete($folder, $existing_row->{$name});
		return TRUE;
	} else if ($required && empty($existing_row->{$name}))
		throw new FileException("File $name is required");
	else
		return TRUE;
}

/**
 * Modify POST data in assoc array to hash the PASSWORD field
 */
function control_password_update(&$updates, $field = 'password') {
	if (!empty($updates[$field])) {
		$updates[$field] = password_hash($updates[$field], PASSWORD_BCRYPT);
		return TRUE;
	}
	return FALSE;
}

function get_default_values($table, $field_key = NULL, $select = '*') {
	if ($field_key === NULL)
		$field_key = $table.'_id';
	$fields = Database::connect()->getFieldNames($table);
	$values = [];
	foreach ($fields as $f) {
		$values[$f] = $f === $field_key ? 0 : '';
	}
	if (is_array( $select )) {
		foreach ($values as $key => $value) {
			if (!in_array($key, $select)) {
				unset($values[$key]);
			}
		}
	}
	return (object)$values;
}

function get_values_at($table, $where) {
	return Database::connect()->table($table)->where($where)->get()->getRow();
}

/**
 * Like load_404, but for 204 (PUT's OK)
 */
function load_204($msg = 'No Content') {
	return load_error($msg, 204);
}

function load_404($msg = 'Not Found') {
	return load_error($msg, 404);
}

/**
 * Like load_404, but for 401
 */
function load_401($msg = 'Unauthorized', $realm = NULL) {
	if ($realm) {
		Services::response()->setHeader('WWW-Authenticate', 'Basic realm="'.$realm.'"');
	}
	return load_error($msg, 401);
}

/**
 * Like load_404, but for 405
 */
function load_405($msg = 'Method is not Available') {
	return load_error($msg, 405);
}

/**
 * Return JSON of PHP data
 */
function load_json($data) {
	$request = Services::request();
	if (CI_DEBUG && !$request->isAJAX()) {
		return view('json', [
			'json' => $data,
			'model' => $request->model ?? NULL,
		]);
	} else {
		return Services::response()->setJSON($data);
	}
}

/**
 * Return JSON of PHP data
 */
function load_info($data = []) {
	$data['status'] = 'Info';
	return load_json($data);
}

/**
 * Return JSON of PHP data
 */
function load_ok($data = []) {
	$data['status'] = 'OK';
	return load_json($data);
}

/**
 * Return JSON of PHP data
 */
function load_error($message, $code = NULL) {
	if ($code) {
		Services::response()->setStatusCode($code);
	}
	return load_json([
		'status'=>'Error',
		'message' => $message
	]);
}

