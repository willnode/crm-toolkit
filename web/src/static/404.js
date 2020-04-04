import React from 'react';
import { Typography, Button } from '@material-ui/core';
import Page from '../widget/page';
import session from '../main/Session';

export default function () {
	return (
		<Page center>
			<Typography variant="h2" gutterBottom>Error :(</Typography>
			<p>Sorry this page this unavailable</p>
			<Button variant="contained" onClick={() => session.history.goBack()}>Go Back</Button>
		</Page>
	)
}