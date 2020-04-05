import React from 'react';
import { DrawerComponent, DrawerListItem } from '../widget/drawer';
import List from '@material-ui/core/List';
import Dashboard from '@material-ui/icons/Dashboard';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';


export default function () {
	return (
		<DrawerComponent>
			<List>
				<DrawerListItem  to="/admin/" icon={Dashboard} label="Dashboard"/>
				<DrawerListItem  to="/admin/user" icon={SupervisedUserCircle} label="Users"/>
			</List>
		</DrawerComponent>
	)
}