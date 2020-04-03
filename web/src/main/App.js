import React, { Component } from 'react';
import Home from '../static/home';
import Login from '../static/login';
import Offline from '../static/offline';
import Layout from '../widget/layout';
import Page404 from '../static/404';
import {
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import session from './Session';


class App extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0.5
    }
  }
  Logout() {
    session.auth = null;
    session.login = null;
    window.localStorage.clear();
    window.sessionStorage.clear();
    return <Redirect to="/login" />
  }
  render() {
    session.history = this.props.history;
    session.counter = this.state.counter;
    session.roll = () => this.forceUpdate();
    session.setCounter = (v) => this.setState({ counter: v });

    return (
      <Layout key={this.state.counter}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/offline">
            <Offline />
          </Route>
          <Route exact path="/logout">
            <this.Logout />
          </Route>
          <Route exact path="/login">
            {
              session.login ? <Redirect to={'/' + session.login.role + '/'} /> : <Login />
            }
          </Route>
          <Route>
  					<Page404 />
	  			</Route>
        </Switch>
      </Layout>
    );
  }
}

export default withRouter(App);
