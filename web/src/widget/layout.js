import React from 'react';
import Header from './header';
import Footer from './footer';
import session from '../main/Session';
import Alert from '@material-ui/lab/Alert';

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

	return (
		<>
			<Header/>
			<Notification/>
			{children}
			<Footer/>
		</>
	)
}