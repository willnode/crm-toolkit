import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { history, extractForm, doLogin, setError } from '../main/Helper';
import { Page, SEO } from '../widget/page';
import { Input, Form, Submit, Checkbox } from '../widget/controls';


function form_login(e) {
  const data = extractForm(e);
  doLogin(
    data.get('username'),
    data.get('password'),
    data.has('rememberme')
  ).then((login) => history().push('/' + login.role)).catch((e) => setError(e))
}

export default function Login() {

  return (
    <Page className="paper center" maxWidth="xs">
      <SEO title="Login to CRM Toolkit" />
      <Avatar className="avatar">
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