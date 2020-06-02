import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { history } from '../main/Helper';
import { Page, SEO } from '../widget/page';

export default function () {
  return (
    <Page className="paper center">
      <SEO title="404 Not Found" />
      <Typography variant="h2" gutterBottom>Error :(</Typography>
      <p>Sorry this page is unavailable</p>
      <Button variant="contained" onClick={() => history().goBack()}>Go Back</Button>
    </Page>
  )
}