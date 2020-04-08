import React from 'react';
import Page from '../widget/page';
import Typography from '@material-ui/core/Typography';
import { login } from '../main/Helper';

export default function () {
	return <Page center>
		<Typography variant="h4" gutterBottom>Welcome Back, {login().name}</Typography>
	</Page>
}