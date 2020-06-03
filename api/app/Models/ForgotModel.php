<?php

namespace App\Models;

class ForgotModel extends BaseModel
{
	protected $table = 'login';
	protected $primaryKey = 'login_id';
	protected $allowedFields = [];
	protected $validationRules = [];
	protected $only = [UPDATE];

	protected $message;

	protected function executeBeforeChange($event)
	{
		extract($event, EXTR_REFS);

		if (!$action) {
			if (!$existing->otp) {
				$data['otp'] = generate_pin();
				// Send forgot email here ($existing, $data['otp'])
				$this->message = "Account found and PIN for password reset is sent";
			} else {
				$this->message = "Account found";
			}
		} else if ($action === 'request') {
			$data['otp'] = generate_pin();
			// Send forgot email here ($existing, $data['otp'])
			$this->message = 'PIN for password reset is sent';
		} else if ($action === 'response') {
			$input_otp = $this->request->getPost('otp');
			if ($input_otp == $existing->otp) {
				$input_pw = $this->request->getPost('password') ?: '';
				if (strlen($input_pw) >= 8) {
					$data['password'] = $input_pw;
					$data['otp'] = null;
					control_password_update($data);
					$this->message = 'Password is successfully saved!';
				} else {
					$this->message = 'PIN is corrent! Please enter the new password';
				}
			} else {
				sendImmediately(load_405('PIN is incorrect'));
			}
		} else {
			sendImmediately(load_405("Wrong Action"));
		}

		return $event;
	}

	protected function executeAfterExecute($event)
	{
		if ($this->message) {
			$event['message'] = $this->message;
		}
		return $event;
	}
}
