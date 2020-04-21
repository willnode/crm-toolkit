import React from 'react';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Dashboard from '@material-ui/icons/Dashboard';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import { Link, Switch, Route, Redirect } from "react-router-dom";
import Home from './home';
import Login from './login';
import Offline from './offline';
import Page404 from './404';
import { login } from 'main/Helper';
import { DrawerComponent, DrawerListItem } from 'widget/drawer';



function RedirectIfLoggedInOrShow({ component }) {
	return login() ? <Redirect to={'/' + login().role + '/'} /> : React.createElement(component);
}

function Main() {
	return <Switch>
		<Route exact path="/" component={Home} />
		<Route exact path="/offline" component={Offline} />
		<Route exact path="/login">
			<RedirectIfLoggedInOrShow component={Login} />
		</Route>
		<Route component={Page404} />
	</Switch>
}

function LeftBar() {
	return (
		<DrawerComponent>
			<List>
				<DrawerListItem to="/" icon={Dashboard} label="Home"/>
				<DrawerListItem to="/login" icon={SupervisedUserCircle} label="Login"/>
			</List>
		</DrawerComponent>
	)
}

function TopBar() {
	return <>
		<Button component={Link} to="/" color="inherit">Home</Button>
		<Button component={Link} to="/login/" color="inherit">Login</Button>
	</>
}

export default {
	role: '',
	main: Main,
	top: TopBar,
	left: LeftBar,
}