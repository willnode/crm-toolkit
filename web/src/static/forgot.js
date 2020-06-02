import React, { useState, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Context } from '../main/Contexts';
import { Page, SEO } from '../widget/page';
import { setMessage, doLogin } from '../main/Helper';
import { Input, Form, Submit } from '../widget/controls';
import { useValidator, required, minLength } from '../widget/validators';
import { validEmail, checkAllValidators, matchesField } from '../widget/validators';

function InnerForm() {
  const actionRef = useRef();
  const [stage, setStage] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const validators = {
    email: useValidator(required(), validEmail()),
    otp: useValidator(...(stage < 1 ? [] : [required(), minLength(6)])),
    password: useValidator(...(stage < 3 ? [] : [required(), minLength(8)])),
    passconf: useValidator(...(stage < 3 ? [] : [required(), matchesField('password')])),
  }
  return <Form action="forgot" redirect={() => {
    if (stage === 3) {
      doLogin(email, password, false).then((login) => [
        setMessage('Your new password has been saved. Welcome back!')
      ]);
    } else {
      setStage(stage + 1);
    }
  }}>
    <input name={'action'} ref={actionRef} hidden />
    <Input validator={validators.email} name="email" inputProps={{ readOnly: stage !== 0 }}
      label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <Box display={stage > 0 ? 'block' : 'none'}>
      <Input validator={validators.otp} name="otp" inputProps={{ readOnly: stage === 3 }}
        label="Token (6 digit)" value={otp} onChange={(e) => setOTP(e.target.value)} />
    </Box>
    <Box display={stage === 3 ? 'block' : 'none'}>
      <Input validator={validators.password} name="password"
        label="New Password" value={password} onChange={(e) => setPassword(e.target.value)}
        type="password" autoComplete="new-password" />
      <Input validator={validators.passconf} name="passconf"
        label="Re-enter New Password" type="password" autoComplete="new-password" />
    </Box>
    <Submit disabled={!checkAllValidators(validators)} onClick={() => [
      actionRef.current.value = stage > 0 ? 'response' : '',
      stage === 1 && setStage(stage + 1),
      Context.set('auth', 'Basic ' + btoa(email + ":-")),
    ]} />
    {stage === 1 && <Submit variant='outlined' onClick={() => [actionRef.current.value = 'request',
    Context.set('auth', 'Basic ' + btoa(email + ":-"))]} label="Not Receiving Token? Send Again" />}
    {stage > 0 && <Button onClick={() => setStage(stage - 1)}>Go Back</Button>}
  </Form>
}

export default function Forgot() {
  return (
    <Page className="paper center" maxWidth="xs">
      <SEO title="Recover your Password" />
      <Avatar className="avatar">
        <Icon>lock_outlined</Icon>
      </Avatar>
      <Typography component="h1" variant="h5">
        Recover your Password
      </Typography>
      <InnerForm />
    </Page>
  );
}