import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useStyles } from '../main/Helper';
import { Link } from 'react-router-dom';
import { RoleTopbars } from '../main/App';

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar position="static" >
      <Toolbar >
        <Typography variant="h6" className={classes.title}>
          CRM Toolkit
        </Typography>
        <RoleTopbars>
          <Button component={Link} to="/" color="inherit">Home</Button>
          <Button component={Link} to="/login" color="inherit">Login</Button>
        </RoleTopbars>
      </Toolbar>
    </AppBar>
  )
}