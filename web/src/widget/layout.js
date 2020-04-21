import React, { useState } from 'react';
import Header from './header';
import Footer from './footer';
import Alert from '@material-ui/lab/Alert';
import Toolbar from '@material-ui/core/Toolbar';
import { Context } from 'main/Contexts';
import { Switch, Route } from 'react-router-dom';

function Notification() {
  Context.bind('message', useState(null));
  Context.bind('error', useState(null));
  return <>
    {(x => x ? <Alert severity="success" color="info">{x}</Alert> : null)(Context.get('message'))}
    {(x => x ? <Alert severity="error">{x}</Alert> : null)(Context.get('error'))}
  </>
}

function RouteByRole({ roles, component }) {
  return <Switch>{roles.map(x => <Route key={x.role} path={'/' + x.role} component={x[component]} />)}</Switch>
}

export default function Layout({ roles }) {
  return (
    <div className="layout-root">
      <Header children={<RouteByRole component="top" roles={roles} />} />
      <div className="layout-side">
        <RouteByRole component="left" roles={roles} />
        <main className="layout-content">
          <Toolbar />
          <Notification />
          <RouteByRole component="main" roles={roles} />
        </main>
        <RouteByRole component="right" roles={roles} />
      </div>
      <Footer children={<RouteByRole component="bottom" roles={roles} />} />
    </div>
  )
}