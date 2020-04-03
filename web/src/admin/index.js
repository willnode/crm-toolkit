import React from 'react';
import Dashboard from './dashboard';
import Profile from './profile';
import User from './user/list';
import UserEdit from './user/edit';
import Page404 from '../static/404';
import {
	Redirect,
	Switch,
	Route,
	useParams
} from 'react-router-dom';
import session from '../Session';

function P() {
	const { id } = useParams();
	return <TransaksiDetail  id={id} key={id}/>
}

export default function () {
	return !session.login || session.login.role !== 'admin' ? <Redirect to="/login" /> : (
		<div className="container mt-4">
			<Switch>
				<Route exact path="/admin">
					<Dashboard />
				</Route>
				<Route exact path="/admin/profile">
					<Profile />
				</Route>
				<Route exact strict path="/admin/user/">
					<User />
				</Route>
				<Route strict path="/admin/user/edit/:id">
					<UserEdit />
				</Route>
				<Route>
					<Page404/>
				</Route>
			</Switch>
		</div>
	)
}