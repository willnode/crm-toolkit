import React from 'react';
import { DrawerComponent, DrawerListItem } from '../widget/drawer';
import List from '@material-ui/core/List';
import Dashboard from '@material-ui/icons/Dashboard';


export default function () {
	return (
		<DrawerComponent>
			<List>
				<DrawerListItem  to="/user/" icon={Dashboard} label="Dashboard"/>
			</List>
		</DrawerComponent>
	)
}