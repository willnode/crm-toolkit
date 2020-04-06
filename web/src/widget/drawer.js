import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { RoleSidebars } from '../main/App';
import { useStyles } from '../main/Helper';
import { Context } from '../main/Contexts';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';


const DrawerListItem = ({ to, icon, label }) => (
	<ListItem component={Link} button to={to}>
		<ListItemIcon>{React.createElement(icon)}</ListItemIcon>
		<ListItemText primary={label} />
	</ListItem>
)

function DrawerComponent({ children }) {
	let classes = useStyles();
	let drawerOpen = useState(false);
	Context.bind('drawerOpen', drawerOpen);
	useEffect(() => (() => Context.unbind('drawerOpen')), [])
	return (
		<nav>
			<Hidden smUp implementation="css">
				<Drawer
					variant="temporary"
					classes={{
						paper: classes.drawerPaper,
					}}
					open={Context.get('drawerOpen')}
					onClose={() => Context.set('drawerOpen', false)}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					<div className={classes.drawerContainer}>
						{children}
					</div>
				</Drawer>
			</Hidden>
			<Hidden xsDown implementation="css">
				<Drawer
					classes={{
						paper: classes.drawerPaper,
					}}
					className={classes.drawer}
					variant="permanent"
					open
				>
					<Toolbar />
					<div className={classes.drawerContainer}>
						{children}
					</div>
				</Drawer>
			</Hidden>
		</nav>
	)
}
export default function () {
	return <RoleSidebars>

	</RoleSidebars>
}

export {
	DrawerComponent, DrawerListItem
}