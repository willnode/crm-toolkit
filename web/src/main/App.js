import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import User from '../user';
import Admin from '../admin';
import Static from '../static';
import { appKey } from './Config';
import Layout from '../widget/layout';
import { popMessages } from './Helper';
import { Context, TemporaryContext } from './Contexts';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      auth: sessionStorage.getItem(appKey + 'appauth') || localStorage.getItem(appKey + 'appauth') || null,
      login: JSON.parse(sessionStorage.getItem(appKey + 'applogin') || localStorage.getItem(appKey + 'applogin') || "null"),
      fetching: false,
      counter: 1,
    };
  }
  componentDidMount() {
    this.props.history.listen(() => {
      popMessages();
    }); // Think we don't need unmount, eh?
  }
  generateBinding(key) {
    return [this.state[key], (v) => this.setState(() => ({ [key]: v }))]
  }
  render() {
    document.body.className = this.props.classes.root;
    TemporaryContext.history = this.props.history;
    TemporaryContext.roles = [Admin, User, Static];
    Context.bind('fetching', this.generateBinding('fetching'));
    Context.bind('auth', this.generateBinding('auth'));
    Context.bind('login', this.generateBinding('login'));
    Context.bind('counter', this.generateBinding('counter'));
    return (
      <Layout
        key={this.state.counter}
        roles={TemporaryContext.roles}
      />
    );
  }
}

export default withRouter(withStyles((theme) => ({
  root: {
    // These props provides a global CSS variable to applied theme.
    // You can use these CSS vars on project root style.css
    // Add more to variables that you need.
    '--background': theme.palette.background.default,
    '--paper': theme.palette.background.paper,
    '--primary': theme.palette.primary.main,
    '--primary-light': theme.palette.primary.light,
    '--primary-dark': theme.palette.primary.dark,
    '--secondary': theme.palette.secondary.main,
    '--secondary-light': theme.palette.secondary.light,
    '--secondary-dark': theme.palette.secondary.dark,
    '--z-index-appbar': (theme.zIndex.drawer + 1),
    '--drawer-width': '240px',
  }, // a style rule
}))(App));