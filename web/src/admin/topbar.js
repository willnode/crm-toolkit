import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import session from '../main/Session';
import Dashboard from '@material-ui/icons/Dashboard';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';

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

const AvatarMenuItem = ({ to, icon, title }) => (
	<MenuItem component={Link} to={to}>
		<ListItemIcon>
			{React.createElement(icon, {fontSize: 'small'})}
		</ListItemIcon>
		<Typography variant="inherit" noWrap>
			{title}
		</Typography>
	</MenuItem>
)

export default function () {
	const [open, setOpen] = React.useState(null);
	return (
		<>
			<IconButton disableRipple size="small" onClick={(e) => setOpen(open ? null : e.currentTarget)}>
				<Avatar alt={session.login.name} src={session.getAvatarUrl()} />
			</IconButton>
			<AvatarMenu anchorEl={open} open={!!open} onClose={() => setOpen(null)} >
				<AvatarMenuItem to="/admin/" icon={Dashboard} title="Dashboard"/>
				<AvatarMenuItem to="/admin/profile/" icon={SupervisedUserCircle} title="Profile"/>
				<AvatarMenuItem to="/logout" icon={ExitToApp} title="Logout"/>
			</AvatarMenu>
		</>
	)
}