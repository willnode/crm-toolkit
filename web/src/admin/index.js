import React from 'react';
import List from '@material-ui/core/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Profile from 'widget/shared/profile';
import User from './user';
import Page404 from 'static/404';
import { CheckRole } from 'widget/controls';
import { SEO } from 'widget/page';
import { LoginMenu, HeaderComponent } from 'widget/header';
import { DrawerComponent, DrawerListItem } from 'widget/drawer';
import { FooterComponent } from 'widget/footer';

function Main() {
  return (
    <CheckRole role='admin'>
      <SEO title="Panel Admin" />
      <Switch>
        <Route exact path="/admin/" component={Dashboard} />
        <Route path="/admin/profile/" component={Profile} />
        <Route path="/admin/user/" component={User} />
        <Route component={Page404} />
      </Switch>
    </CheckRole>
  )
}

function LeftBar() {
  return (
    <DrawerComponent>
      <List>
        <DrawerListItem to="/admin/" icon={DashboardIcon} label="Dashboard" />
        <DrawerListItem to="/admin/user/" icon={SupervisedUserCircleIcon} label="Users" />
      </List>
    </DrawerComponent>
  )
}

function TopBar() {
  return (
    <HeaderComponent>
      <LoginMenu />
    </HeaderComponent>
  );
}

function BottomBar() {
  return <FooterComponent />
}


export default {
  role: 'admin',
  main: Main,
  top: TopBar,
  left: LeftBar,
  bottom: BottomBar,
}