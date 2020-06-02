import React from 'react';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import { Switch, Route } from 'react-router-dom';
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
    <CheckRole role='user'>
      <SEO title="Panel User" />
      <Switch>
        <Route exact path="/user/" component={Dashboard} />
        <Route path="/user/profile/" component={Profile} />
        <Route component={Page404} />
      </Switch>
    </CheckRole>
  )
}

function LeftBar() {
  return (
    <DrawerComponent>
      <List>
        <DrawerListItem to="/user/" icon={() => <Icon>dashboard</Icon>} label="Dashboard" />
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
  role: 'user',
  main: Main,
  top: TopBar,
  left: LeftBar,
  bottom: BottomBar
}