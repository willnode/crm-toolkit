import React, { Component } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import Admin, { Sidebar as AdminSidebar, Topbar as AdminTopbar } from '../admin';
import User, { Sidebar as UserSidebar, Topbar as UserTopbar } from '../user';
import StaticRooms from '../static/';
import Layout from '../widget/layout';
import { Context, TemporaryContext } from './Contexts';
import { popMessages, login } from './Helper';
import { appKey } from './Config';


const RoleRooms = (props) => (
  <Switch>
    <Route path="/admin" component={Admin} />
    <Route path="/user" component={User} />
    <Route {...props} />
  </Switch>
)

const RoleSidebars = (props) => (
  <Switch>
    <Route path="/admin" component={login() && AdminSidebar} />
    <Route path="/user" component={login() && UserSidebar} />
    <Route {...props} />
  </Switch>
)

const RoleTopbars = (props) => (
  <Switch>
    <Route path="/admin" component={login() && AdminTopbar} />
    <Route path="/user" component={login() && UserTopbar} />
    <Route {...props} />
  </Switch>
)

class App extends Component {
  state = {
    auth: sessionStorage.getItem(appKey + 'appauth') || localStorage.getItem(appKey + 'appauth') || null,
    login: JSON.parse(sessionStorage.getItem(appKey + 'applogin') || localStorage.getItem(appKey + 'applogin') || "null"),
    fetching: false,
    counter: 1,
  }
  componentDidMount() {
    TemporaryContext.history = this.props.history;
    this.props.history.listen(() => {
      popMessages();
    }); // Think we don't need unmount, eh?
  }
  generateBinding(key) {
    return [this.state[key], (v) => this.setState(() => ({ [key]: v }))]
  }
  render() {
    Context.bind('fetching', this.generateBinding('fetching'));
    Context.bind('auth', this.generateBinding('auth'));
    Context.bind('login', this.generateBinding('login'));
    Context.bind('counter', this.generateBinding('counter'));
    return (
      <Layout>
        <RoleRooms key={this.state.counter} component={StaticRooms} />
      </Layout>
    );
  }
}

export default withRouter(App);

export {
  RoleSidebars, RoleTopbars, RoleRooms
}
