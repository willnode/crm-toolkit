import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Page } from '../../widget/page';
import { Context } from '../../main/Contexts';
import { appKey } from '../../main/Config';
import { Form, Input, Submit, File } from '../../widget/controls';
import { doLogin, login, setMessage, doReload } from '../../main/Helper';
import { checkAllValidators, matchesRegex } from '../../widget/validators';
import { matchesValue, matchesField, requireField } from '../../widget/validators';
import { useValidator, required, minLength, validEmail } from '../../widget/validators';

function submit(_, data) {
  doLogin(
    (data.get('email')),
    (data.get('password')).then(
      () => setMessage('Successfully Saved')
    )
  );
}

export default function () {
  const role = login().role;
  const curPassword = React.useMemo(() => (
    atob(Context.get('auth').substr(6)).split(':', 2)[1]
  ), []);
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
          <Input validator={validators.name} name="name" label="Name"
            defaultValue={data.name} />
          <Input validator={validators.email} name="email" label="Email"
            defaultValue={data.email} type="email" />
          <File folder="avatar" name="avatar" label="Avatar"
            defaultValue={data.avatar} accept="image/*" />
          <Box marginTop={5}>If you need to change your password, enter the new password:</Box>
          <Input validator={validators.oldpass} name="oldpass" type="password"
            label="Current Password" autoComplete="current-password" />
          <Input validator={validators.password} name="password" type="password"
            label="New Password" autoComplete="new-password" />
          <Input validator={validators.passconf} name="passconf" type="password"
            label="Re-enter New Password" autoComplete="new-password" />
          <Submit disabled={!checkAllValidators(validators)} />
        </Form>
      )}
    </Page>
  )
}