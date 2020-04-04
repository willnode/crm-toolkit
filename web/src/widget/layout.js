import React from 'react';
import Header from './header';
import Footer from './footer';
import session from '../main/Session';

function Notification() {

	const message = session.message;
	const error = session.error;
	session.message = '';
	session.error = '';

	return <>
			{
				message ?
				<div className="alert alert-primary">
				{''+message}
			</div> : ''
			}
			{
				error ?
				<div className="alert alert-danger">
					{''+error}
				</div> : ''
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