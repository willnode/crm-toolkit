import session from '../main/Session';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../main/Helper';
import Page from '../widget/page';
import { Input, Form, Submit, Checkbox } from '../widget/controls';


async function form_login(e) {
  const data = session.extract(e);
  session.auth = 'Basic ' + btoa(data.get('username') + ':' + data.get('password'));
  try {
    const { login } = await session.get('login');
    session.login = login;
    session.history.push('/' + login.role);
    const storage = data.has('rememberme') ? localStorage : sessionStorage;
    storage.setItem('appauth', session.auth);
    storage.setItem('applogin', JSON.stringify(login));
  } catch {
    session.auth = null;
    session.reload();
  }
}

export default function Login() {
  const classes = useStyles();

  return (
    <Page maxWidth="sm" center>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Form onSubmit={form_login}>
          <Input name="username" required autoComplete="username"/>
          <Input name="password" required autoComplete="current-password" type="password"/>
          <Checkbox name="rememberme" label="Remember me"  />
          <Submit label="Sign In" />
        </Form>
    </Page>
  );
}