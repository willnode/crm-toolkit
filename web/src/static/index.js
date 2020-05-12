import React from 'react';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import DashboardIcon from '@material-ui/icons/Dashboard';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CreateIcon from '@material-ui/icons/Create';
import HistoryIcon from '@material-ui/icons/History';
import { Link, Switch, Route, Redirect } from "react-router-dom";
import Home from './home';
import Login from './login';
import Forgot from './forgot';
import Register from './register';
import Offline from './offline';
import Page404 from './404';
import { login, getQueryParam } from '../main/Helper';
import { DrawerComponent, DrawerListItem } from '../widget/drawer';
import { HeaderComponent } from '../widget/header';
import { FooterComponent } from '../widget/footer';


function RedirectIfLoggedInOrShow({ component : Comp }) {
  return login() ? <Redirect to={getQueryParam('redirect') || '/' + login().role + '/'} /> : <Comp />;
}

function Main() {
  return <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/offline" component={Offline} />
    <Route exact path="/login">
      <RedirectIfLoggedInOrShow component={Login} />
    </Route>
    <Route exact path="/register">
      <RedirectIfLoggedInOrShow component={Register} />
    </Route>
    <Route exact path="/forgot">
      <RedirectIfLoggedInOrShow component={Forgot} />
    </Route>
    <Route component={Page404} />
  </Switch>
}

function LeftBar() {
  return (
    <DrawerComponent>
      <List>
        <DrawerListItem to="/" icon={DashboardIcon} label="Home" />
        <DrawerListItem to="/login/" icon={VpnKeyIcon} label="Login" />
        <DrawerListItem to="/register/" icon={CreateIcon} label="Register" />
        <DrawerListItem to="/forgot/" icon={HistoryIcon} label="Recover" />
      </List>
    </DrawerComponent>
  )
}

function TopBar() {
  return (
    <HeaderComponent>
      <Hidden xsDown implementation="css">
        <Button component={Link} to="/" color="inherit">Home</Button>
        <Button component={Link} to="/login/" color="inherit">Login</Button>
        <Button component={Link} to="/register/" color="inherit">Register</Button>
      </Hidden>
    </HeaderComponent>
  )
}

function BottomBar() {
  return <FooterComponent />
}

export default {
  role: '',
  main: Main,
  top: TopBar,
  left: LeftBar,
  bottom: BottomBar
}