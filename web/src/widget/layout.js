import React, { useState } from 'react';
import Header from './header';
import Drawer from './drawer';
import Footer from './footer';
import Alert from '@material-ui/lab/Alert';
import Toolbar from '@material-ui/core/Toolbar';
import { useStyles } from '../main/Helper';
import { Context, TemporaryContext } from '../main/Contexts';
import { useEffect } from 'react';

function Notification() {
	Context.bind('message', useState(null));
	Context.bind('error', useState(null));
	useEffect(() => {
		TemporaryContext.pushError = null;
		TemporaryContext.pushMessage = null;
	})
	return <>
			{(x => x ? <Alert severity="success" color="info">{x}</Alert> : null)(Context.get('message'))}
			{(x => x ? <Alert severity="error">{x}</Alert> : null)(Context.get('error'))}
		</>
}

export default function Layout({ children }) {
	let classes = useStyles();
	return (
		<>
			<Header />
			<div className={classes.root}>
				<Drawer />
				<main className={classes.content}>
					<Toolbar />
					<Notification />
					{children}
					<Footer />
				</main>
			</div>
		</>
	)
}