import React from 'react';
import List from '@material-ui/core/List';
import Icon from '@material-ui/core/Icon';
import { Switch, Route } from 'react-router-dom';
import User from './user';
import Dashboard from './dashboard';
import Page404 from '../static/404';
import { SEO } from '../widget/page';
import Profile from '../widget/shared/profile';
import { CheckRole } from '../widget/controls';
import { FooterComponent } from '../widget/footer';
import { LoginMenu, HeaderComponent } from '../widget/header';
import { DrawerComponent, DrawerListItem } from '../widget/drawer';

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
        <DrawerListItem to="/admin/" icon={() => <Icon>dashboard</Icon>} label="Dashboard" />
        <DrawerListItem to="/admin/user/" icon={() => <Icon>supervised_user_circle</Icon>} label="Users" />
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