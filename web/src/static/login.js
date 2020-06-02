import React from 'react';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Page, SEO } from '../widget/page';
import { extractForm, doLogin, setError } from '../main/Helper';
import { Input, Form, Submit, Checkbox } from '../widget/controls';


function form_login(e) {
  const data = extractForm(e);
  doLogin(
    data.get('username'),
    data.get('password'),
    data.has('rememberme')
  ).catch((e) => setError(e))
}

export default function Login() {

  return (
    <Page className="paper center" maxWidth="xs">
      <SEO title="Login to CRM Toolkit" />
      <Avatar className="avatar">
        <Icon>lock_outlined</Icon>
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