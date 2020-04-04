import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import session from '../main/Session';
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

export default function () {
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<IconButton onClick={(e) => setOpen(open ? null : e.target)}>
				<Avatar alt={session.login.name} src={session.getAvatarUrl()} />
			</IconButton>
			<AvatarMenu anchorEl={open} open={!!open} onClose={() => setOpen(null)} >
				<MenuItem component={Link} to="/logout">
					<ListItemIcon>
						<ExitToApp fontSize="small" />
					</ListItemIcon>
					<Typography variant="inherit" noWrap>
						A very long text that overflows
         			</Typography>
				</MenuItem>
			</AvatarMenu>
		</>
	)
}