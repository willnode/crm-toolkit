import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Dashboard from '@material-ui/icons/Dashboard';
import People from '@material-ui/icons/People';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { getAvatarUrl, login, doLogout } from '../main/Helper';
import { ListItemText } from '@material-ui/core';

const AvatarMenu = (props) => <Menu
	{...props} elevation={4}
	getContentAnchorEl={null}
	anchorOrigin={{
		vertical: 50,
		horizontal: 'center',
	}}
	transformOrigin={{
		vertical: 'top',
		horizontal: 'center',
	}}
/>;

export default function () {
	const [open, setOpen] = React.useState(null);
	return (
		<>
			<IconButton disableRipple size="small" onClick={(e) => setOpen(open ? null : e.currentTarget)}>
				<Avatar alt={login().name} src={getAvatarUrl()} />
			</IconButton>
			<AvatarMenu anchorEl={open} open={!!open} onClose={() => setOpen(null)} >
				<MenuItem component={Link} to="/admin">
					<ListItemIcon children={<Dashboard/>}/>
					<ListItemText children="Dashboard"/>
				</MenuItem>
				<MenuItem component={Link} to="/admin/profile">
					<ListItemIcon children={<People/>}/>
					<ListItemText children="Profile"/>
				</MenuItem>
				<MenuItem onClick={doLogout}>
					<ListItemIcon children={<ExitToApp/>}/>
					<ListItemText children="Logout"/>
				</MenuItem>
			</AvatarMenu>
		</>
	)
}