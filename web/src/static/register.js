import React from 'react';
import Page, { SEO } from '../widget/page';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Form, Input, Submit, Checkbox } from '../widget/controls';
import Typography from '@material-ui/core/Typography';
import { doLogin, setMessage, history } from '../main/Helper';
import {
  useValidator, required, minLength, validEmail,
  checkAllValidators, matchesRegex, matchesField
} from '../widget/validators';

function submit(_, data) {
  doLogin(
    (data.get('email')),
    (data.get('password')),
    (data.get('rememberme'))).then((login) => [history().push('/' + login.role), setMessage('Welcome!')]);
}

export default function () {
  const validators = {
    name: useValidator(required(), minLength(3), matchesRegex(/^[\w -'"]+$/)),
    email: useValidator(required(), validEmail()),
    password: useValidator(required(), minLength(8)),
    passconf: useValidator(required(), matchesField('password')),
  }
  return (
    <Page className="paper center" maxWidth="xs" >
      <SEO title="Register to CRM Toolkit" />
      <Avatar className="avatar">
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Form action="register" redirect={submit}>
        <Input validator={validators.name} name="name" label="Name" />
        <Input validator={validators.email} name="email" label="Email" type="email" />
        <Input validator={validators.password} name="password" label="Password" type="password" autoComplete="new-password" />
        <Input validator={validators.passconf} name="passconf" label="Re-enter Password" type="password" autoComplete="new-password" />
        <Checkbox name="rememberme" label="Remember me" />
        <Submit disabled={!checkAllValidators(validators)} />
      </Form>
    </Page>)
}