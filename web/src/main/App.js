import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Admin, { Sidebar as AdminSidebar, Topbar as AdminTopbar } from '../admin';
import Home from '../static/home';
import Login from '../static/login';
import Offline from '../static/offline';
import Layout from '../widget/layout';
import Page404 from '../static/404';
import session from './Session';

const Logout = function () {
  session.auth = null;
  session.login = null;
  localStorage.clear();
  sessionStorage.clear();
  return <Redirect to="/login" />
}

const RoleRooms = (props) => (
  <Switch>
    <Route path="/admin" component={Admin} />
    <Route {...props} />
  </Switch>
)

const RoleSidebars = (props) => (
  <Switch>
    <Route path="/admin" component={AdminSidebar} />
    <Route {...props} />
  </Switch>
)

const RoleTopbars = (props) => (
  <Switch>
    <Route path="/admin" component={AdminTopbar} />
    <Route {...props} />
  </Switch>
)

function RedirectIfLoggedInOrShow({ component }) {
  return session.login ? <Redirect to={'/' + session.login.role + '/'} /> : React.createElement(component);
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0.5
    }
  }
  componentDidMount() {
    session.history = this.props.history;
    session.counter = this.state.counter;
    session.roll = () => this.forceUpdate();
    session.setCounter = (v) => this.setState({ counter: v });
  }
  componentDidUpdate() {
    session.counter = this.state.counter;
  }
  render() {
    return (
      <Layout key={this.state.counter}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/offline" component={Offline} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/login">
            <RedirectIfLoggedInOrShow component={Login} />
          </Route>
          <RoleRooms component={Page404} />
        </Switch>
      </Layout>
    );
  }
}

export default withRouter(App);

export {
  RoleSidebars, RoleTopbars
}
