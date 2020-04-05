import React, { useState } from 'react';
import Page from '../../widget/page';
import {
	Form, Input, Submit, BackButton
} from '../../widget/controls';
import { useParams } from 'react-router-dom';


export default function () {
	const id = useParams().id || 0;
	const [d, setData] = useState(null);
	const data = (d && d.data);
	return (
		<Page src={'user/' + id} dataCallback={setData}>
			{!data ? '' : (
			<Form action={"admin/user/"+id}>
				<Input name="username" required label="Username" value={data.username}/>
				<Input name="name" required label="Name" value={data.name}/>
				<Input name="email" required type="email" label="Email" value={data.email}/>
				<Submit />
			</Form>)}
			<BackButton />
		</Page>)
}
