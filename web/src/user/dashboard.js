import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Link } from 'react-router-dom';
import { Page } from '../widget/page';
import { login } from '../main/Helper';
import { getAvatarUrl } from '../main/Helper';

export default function () {
  return <Page className="paper center">
    <img className="avatar dashboard" src={getAvatarUrl(login().avatar)} alt="Avatar" />
    <Typography variant="h4" gutterBottom>Welcome Back, {login().name}</Typography>
    <ButtonGroup variant="contained" color="primary">
      <Button component={Link} to="/user/profile">Profile</Button>
    </ButtonGroup>
  </Page>
}