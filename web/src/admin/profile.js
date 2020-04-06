import React, { useState } from 'react';
import Page from '../widget/page';
import { Form, Input, Submit } from '../widget/controls';
import Typography from '@material-ui/core/Typography';
import { Context } from '../main/Contexts';
import { doLogin, login, setMessage } from '../main/Helper';
import { appKey } from '../main/Config';

function submit(data) {
	doLogin(
		(data.get('email') || login().email),
		(data.get('password') || (atob(Context.get('auth').substr(6)).split(':', 2)[1])),
		Boolean(localStorage.getItem(appKey + 'appauth'))).then(x => setMessage('Successfully Saved'));
}

export default function () {
	const [data, setData] = useState(null);
	const form = data && data.data;
	return (
		<Page src="admin/profile" maxWidth="md" dataCallback={setData} >
			<Typography variant="h4">Edit Profile</Typography>
			{
				data ? (
					<Form redirect={submit}>
						<Input name="name" label="Name" value={form.name} required minLength={3} />
						<Input name="email" label="Email" value={form.email} required type="email" />
						<hr />
						<Input name="password" label="New Password" type="password" minLength={8} autoComplete="new-password" />

						<Submit />
					</Form>
				) : null
			}
		</Page>)
}