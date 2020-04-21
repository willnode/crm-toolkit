import React from 'react';
import List from '@material-ui/core/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Profile from './profile';
import Page404 from 'static/404';
import { CheckRole } from 'widget/controls';
import { SEO } from 'widget/page';
import { LoginMenu } from 'widget/header';
import { DrawerComponent, DrawerListItem } from 'widget/drawer';

function Main () {
	return (
		<CheckRole role='user'>
			<SEO title="Panel User"/>
			<Switch>
				<Route exact path="/user" component={Dashboard} />
				<Route path="/user/profile" component={Profile} />
				<Route component={Page404} />
			</Switch>
		</CheckRole>
	)
}

function LeftBar() {
	return (
		<DrawerComponent>
			<List>
				<DrawerListItem to="/user/" icon={DashboardIcon} label="Dashboard"/>
			</List>
		</DrawerComponent>
	)
}

function TopBar() {
	return (
		<LoginMenu />
	);
}

export default {
	role: 'user',
	main: Main,
	top: TopBar,
	left: LeftBar,
}