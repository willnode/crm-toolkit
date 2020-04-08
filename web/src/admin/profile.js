import React, { useState, useMemo } from 'react';
import Page from '../widget/page';
import { Form, Input, Submit, File } from '../widget/controls';
import Typography from '@material-ui/core/Typography';
import { Context } from '../main/Contexts';
import { doLogin, login, setMessage } from '../main/Helper';
import { appKey } from '../main/Config';
import {
	useValidator, required, minLength, validEmail,
	matchesValue, matchesField, requireField, checkAllValidators
} from '../widget/validators';
import Box from '@material-ui/core/Box';

function submit(_, data) {
	doLogin(
		(data.get('email') || login().email),
		(data.get('password') || (atob(Context.get('auth').substr(6)).split(':', 2)[1])),
		Boolean(localStorage.getItem(appKey + 'appauth'))).then(() => setMessage('Successfully Saved'));
}

export default function () {
	const [data, setData] = useState(null);
	const curPassword = useMemo(() => (atob(Context.get('auth').substr(6)).split(':', 2)[1]), []);
	const form = data && data.data;
	const validators = {
		name: useValidator(required(), minLength(3)),
		email: useValidator(required(), validEmail()),
		oldpass: useValidator(matchesValue(curPassword)),
		password: useValidator(requireField('oldpass'), minLength(8)),
		passconf: useValidator(matchesField('password')),
	}
	return (
		<Page src="admin/profile" maxWidth="md" dataCallback={setData} >
			<Typography variant="h4">Edit Profile</Typography>
			{
				data ? (
					<Form action="admin/profile" redirect={submit}>
						<Input validator={validators.name} name="name" label="Name" defaultValue={form.name} required />
						<Input validator={validators.email} name="email" label="Email" defaultValue={form.email} required type="email" />
						<File name="avatar" label="Avatar" defaultValue={form.avatar} />
						<Box marginTop={5}>If you need to change your password, enter the new password:</Box>
						<Input validator={validators.oldpass} name="oldpass" label="Current Password" type="password" minLength={8} autoComplete="current-password" />
						<Input validator={validators.password} name="password" label="New Password" type="password" minLength={8} autoComplete="new-password" />
						<Input validator={validators.passconf} name="passconf" label="Re-enter New Password" type="password" minLength={8} autoComplete="new-password" />
						<Submit disabled={!checkAllValidators(validators)} />
					</Form>
				) : null
			}
		</Page>)
}