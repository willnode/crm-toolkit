import React from 'react';
import Home from './home';
import Login from './login';
import Offline from './offline';
import Page404 from './404';
import { Switch, Route, Redirect } from "react-router-dom";
import { login } from '../main/Helper';
import { Context } from '../main/Contexts';


function RedirectIfLoggedInOrShow({ component }) {
	return login() ? <Redirect to={'/' + login().role + '/'} /> : React.createElement(component);
}

export default function Static() {
	return <Switch>
		<Route exact path="/" component={Home} />
		<Route exact path="/offline" component={Offline} />
		<Route exact path="/login">
			<RedirectIfLoggedInOrShow component={Login} />
		</Route>
		<Route component={Page404} />
	</Switch>
}