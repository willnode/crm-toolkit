import React from 'react';
import Page from '../widget/page';
import session from '../main/Session';
import { Typography } from '@material-ui/core';

export default function () {
	return <Page center>
		<Typography variant="h4" gutterBottom>Welcome Back, {session.login.name}</Typography>
	</Page>
}