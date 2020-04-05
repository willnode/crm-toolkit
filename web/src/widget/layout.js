import React from 'react';
import Header from './header';
import Drawer from './drawer';
import Footer from './footer';
import session from '../main/Session';
import Alert from '@material-ui/lab/Alert';
import Toolbar from '@material-ui/core/Toolbar';
import { useStyles } from '../main/Helper';

function Notification() {

	const message = session.message;
	const error = session.error;
	session.message = '';
	session.error = '';

	return <>
			{
				message ? <Alert severity="success" color="info">{''+message}</Alert> : ''
			}
			{
				error ? <Alert severity="error">{''+error}</Alert> : ''
			}
		</>
}

export default function Layout({ children }) {
	let classes = useStyles();
	let ref = React.useRef();
	let [drawerOpen, setDrawerOpen] = React.useState(false);
	session.drawerOpen = drawerOpen;
	session.toggleDrawerOpen = () => setDrawerOpen(!drawerOpen);
	return (
		<div ref={ref} className={classes.root}>
			<Header/>
			<Drawer container={ref}/>
			<main className={classes.content}>
				<Toolbar/>
				<Notification/>
				{children}
				<Footer/>
			</main>
		</div>
	)
}