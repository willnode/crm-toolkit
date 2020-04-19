import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useStyles } from '../main/Helper';
import { Link } from 'react-router-dom';
import { RoleTopbars } from '../main/App';
import { Context } from '../main/Contexts';

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Hidden smUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => Context.set('drawerOpen', !Context.get('drawerOpen'))}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h6" className={classes.title}>
          CRM Toolkit
        </Typography>
        <RoleTopbars>
          <Button component={Link} to="/" color="inherit">Home</Button>
          <Button component={Link} to="/login/" color="inherit">Login</Button>
        </RoleTopbars>
      </Toolbar>
    </AppBar>
  )
}