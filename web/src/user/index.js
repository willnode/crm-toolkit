import React from 'react';
import Dashboard from './dashboard';
import Profile from './profile';
import Page404 from '../static/404';
import Sidebar from './sidebar';
import Topbar from './topbar';
import { Switch, Route } from 'react-router-dom';
import { CheckRole } from '../widget/controls';
import { SEO } from '../widget/page';

export default function () {
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

export { Sidebar, Topbar }