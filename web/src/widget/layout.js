import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Switch, Route } from 'react-router-dom';
import { Context } from '../main/Contexts';

function Notification() {
  Context.bind('message', useState(null));
  Context.bind('error', useState(null));
  return (<>
    {(x => x ? <Alert severity="success" color="info">{x}</Alert> : null)(Context.get('message'))}
    {(x => x ? <Alert severity="error">{x}</Alert> : null)(Context.get('error'))}
  </>)
}

export function RouteByRole({ roles, component }) {
  return (
    <Switch>
      {roles.map(x => <Route key={x.role}
        path={'/' + x.role} component={x[component]} />)}
    </Switch>
  )
}

export default function Layout({ roles }) {
  return (
    <div className="layout-root">
      <RouteByRole component="top" roles={roles} />
      <div className="layout-side">
        <RouteByRole component="left" roles={roles} />
        <main className="layout-content">
          <Notification />
          <RouteByRole component="main" roles={roles} />
          <RouteByRole component="bottom" roles={roles} />
        </main>
        <RouteByRole component="right" roles={roles} />
      </div>
    </div>
  )
}