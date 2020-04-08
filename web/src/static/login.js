import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useStyles, serverGet, history, extractForm } from '../main/Helper';
import Page, { SEO } from '../widget/page';
import { Input, Form, Submit, Checkbox } from '../widget/controls';
import { Context } from '../main/Contexts';
import { appKey } from '../main/Config';


async function form_login(e) {
  const data = extractForm(e);
  Context.set('auth', 'Basic ' + btoa(data.get('username') + ':' + data.get('password')));
  try {
    const { login } = await serverGet('login');
    history().push('/' + login.role);
    Context.set('login', login);
    const storage = data.has('rememberme') ? localStorage : sessionStorage;
    storage.setItem(appKey + 'appauth', Context.get('auth'));
    storage.setItem(appKey + 'applogin', JSON.stringify(login));
  } catch {
    Context.set('auth', null);
  }
}

export default function Login() {
  const classes = useStyles();

  return (
    <Page maxWidth="sm" center>
      <SEO title="Login to CRM Toolkit" />
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
        </Typography>
      <Form onSubmit={form_login}>
        <Input name="username" required label="Username" />
        <Input name="password" required label="Password" autoComplete="current-password" type="password" />
        <Checkbox name="rememberme" label="Remember me" />
        <Submit label="Sign In" />
      </Form>
    </Page>
  );
}