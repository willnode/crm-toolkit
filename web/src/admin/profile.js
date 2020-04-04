import React, { useState } from 'react';
import Page from '../widget/page';
import { Form, Input, Submit } from '../widget/controls';
import session from '../main/Session';
import Typography from '@material-ui/core/Typography';

function submit(e) {
	const data = session.extract(e);
	(session.postByRole('profile/', data)
		.then(async () => {
			session.auth = 'Basic ' + btoa((data.get('email') || session.login.email) + ':'
				+ (data.get('password') || (atob(session.auth.substr(6)).split(':', 2)[1])));
			try {
				const { login } = await session.get('login');
				session.login = login;
				session.history.push('/' + login.role);
				window.localStorage.setItem('appauth', session.auth);
				window.localStorage.setItem('applogin', JSON.stringify(login));
				session.setMessage('Berhasil disimpan');
			} catch {
				session.auth = null;
			}
		})
		.catch((e) => session.setError(e))
	)
}

export default function () {
	const [data, setData] = useState(null);
	const form = data && data.data;
	return (
		<Page src="profile" maxWidth="md" dataCallback={setData} >
			<Typography variant="h4">Edit Profile</Typography>
			{
				data ? (
					<Form onSubmit={submit}>
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