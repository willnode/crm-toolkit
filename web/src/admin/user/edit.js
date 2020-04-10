import React, { useState } from 'react';
import Page from '../../widget/page';
import {
	Form, Input, Submit, BackButton,
	CommandButton, FlexGroup
} from '../../widget/controls';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { doReload, history } from '../../main/Helper';
import {
	useValidator, required, minLength,
	matchesRegex, checkAllValidators, validEmail
} from '../../widget/validators';


export default function () {
	const id = useParams().id || 0;
	const [d, setData] = useState(null);
	const data = (d && d.data);

	const validators = {
		username: useValidator(required(), minLength(3), matchesRegex(/^\w+$/)),
		name: useValidator(required(), minLength(3), matchesRegex(/^[\w -'"]+$/)),
		email: useValidator(required(), validEmail()),
	}

	return (
		<Page src={'admin/user/' + id} dataCallback={setData}>
			{!data ? '' : (
				<Form action={"admin/user/" + id} redirect={id > 0 ? doReload : (json) => history().push('/admin/user/edit/'+json.id)}>
					<Input validator={validators.username} name="username" required label="Username" defaultValue={data.username} />
					<Input validator={validators.name} name="name" required label="Name" defaultValue={data.name} />
					<Input validator={validators.email} name="email" required type="email" label="Email" defaultValue={data.email} />
					{
						id > 0 ? <>
							<Box marginTop={5}>If user has trouble logging in, you can give them OTP as temporary login password:</Box>
							<Input inputProps={{ readOnly: true }} label="OTP" value={data.otp || ''} />
							<FlexGroup label="Configure OTP">
								<CommandButton name="otp_invoke" label="Generate" color="primary" />
								<CommandButton name="otp_revoke" disabled={!data.otp} label="Revoke" color="secondary" />
							</FlexGroup>
						</> : <input name="otp_invoke" value="y" readOnly hidden/>
					}
					<Submit disabled={!checkAllValidators(validators)} />
				</Form>)}
			<BackButton />
		</Page>)
}
