import React from 'react';
import { Container } from '@material-ui/core';
import { useStyles } from '../main/Helper';

export default function Home() {
	const classes = useStyles();

	return (<Container>
		<div className={classes.paper}>
			Hello world
		</div>
	</Container>)
}