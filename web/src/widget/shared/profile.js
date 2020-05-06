import React, { useMemo } from 'react';
import { Page } from '../../widget/page';
import { Form, Input, Submit, File } from '../../widget/controls';
import Typography from '@material-ui/core/Typography';
import { Context } from '../../main/Contexts';
import { doLogin, login, setMessage, doReload } from '../../main/Helper';
import { appKey } from '../../main/Config';
import {
  useValidator, required, minLength, validEmail,
  matchesValue, matchesField, requireField,
  checkAllValidators, matchesRegex
} from '../../widget/validators';
import Box from '@material-ui/core/Box';

function submit(_, data) {
  doLogin(
    (data.get('email') || login().email),
    (data.get('password') || (atob(Context.get('auth').substr(6)).split(':', 2)[1])),
    Boolean(localStorage.getItem(appKey + 'appauth'))).then(() => [doReload(), setMessage('Successfully Saved')]);
}

export default function () {
  const role = login().role;
  const curPassword = useMemo(() => (atob(Context.get('auth').substr(6)).split(':', 2)[1]), []);
  const validators = {
    name: useValidator(required(), minLength(3), matchesRegex(/^[\w -'"]+$/)),
    email: useValidator(required(), validEmail()),
    oldpass: useValidator(matchesValue(curPassword)),
    password: useValidator(requireField('oldpass'), minLength(8)),
    passconf: useValidator(matchesField('password')),
  }
  return (
    <Page className="paper" maxWidth="sm" src={`${role}/profile`}>
      {({ data }) => (
        <Form action={`${role}/profile`} redirect={submit}>
          <Typography variant="h4">Edit Profile</Typography>
          <Input validator={validators.name} name="name" label="Name" defaultValue={data.name} />
          <Input validator={validators.email} name="email" label="Email" defaultValue={data.email} type="email" />
          <File folder="avatar" name="avatar" label="Avatar" defaultValue={data.avatar} accept="image/*" />
          <Box marginTop={5}>If you need to change your password, enter the new password:</Box>
          <Input validator={validators.oldpass} name="oldpass" label="Current Password" type="password" autoComplete="current-password" />
          <Input validator={validators.password} name="password" label="New Password" type="password" autoComplete="new-password" />
          <Input validator={validators.passconf} name="passconf" label="Re-enter New Password" type="password" autoComplete="new-password" />
          <Submit disabled={!checkAllValidators(validators)} />
        </Form>
      )}
    </Page>
  )
}