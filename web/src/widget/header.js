import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Dashboard from '@material-ui/icons/Dashboard';
import People from '@material-ui/icons/People';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import { appTitle } from 'main/Config';
import { Context } from 'main/Contexts';
import { getAvatarUrl, login, doLogout } from 'main/Helper';

export function LoginMenu() {
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
  const role = login() && login().role;
  const [open, setOpen] = React.useState(null);
  if (!role) return <></>
  return (
    <>
      <IconButton disableRipple size="small" onClick={(e) => setOpen(open ? null : e.currentTarget)}>
        <Avatar alt={login().name} src={getAvatarUrl()} />
      </IconButton>
      <AvatarMenu anchorEl={open} open={!!open} onClose={() => setOpen(null)} >
        <MenuItem component={Link} onClick={() => setOpen(null)} to={`/${role}`}>
          <ListItemIcon children={<Dashboard />} />
          <ListItemText children="Dashboard" />
        </MenuItem>
        <MenuItem component={Link} onClick={() => setOpen(null)} to={`/${role}/profile`}>
          <ListItemIcon children={<People />} />
          <ListItemText children="Profile" />
        </MenuItem>
        <MenuItem onClick={doLogout}>
          <ListItemIcon children={<ExitToApp />} />
          <ListItemText children="Logout" />
        </MenuItem>
      </AvatarMenu>
    </>
  )
}

export function HeaderComponent({ children }) {
  return (
    <AppBar position="sticky" className="appbar-root">
      <Toolbar>
        <Hidden smUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => Context.set('drawerOpen', !Context.get('drawerOpen'))}
            className="appbar-menubutton"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h6" className="appbar-title">
          {appTitle}
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  )
}