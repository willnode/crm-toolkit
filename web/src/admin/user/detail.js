import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Page } from '../../widget/page';
import { useParams } from 'react-router-dom';
import { getAvatarUrl } from '../../main/Helper';
import { BackButton } from '../../widget/controls';


export default function () {
  const id = useParams().id || 0;
  const subContentVariants = {
    variant: 'button',
    display: 'block',
    gutterBottom: true,
  };
  return (
    <Page className="paper" maxWidth="sm" src={'admin/user/' + id}>
      {({ data }) => (
        <div>
          <Box textAlign="center">
            <img className="avatar dashboard" src={getAvatarUrl(data.avatar)} alt="Avatar" />
          </Box>
          <Grid container>
            <Grid item xs={12}>
              <Typography align="center" display="block" variant="h3" gutterBottom>
                {data.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline">Username</Typography>
              <Typography {...subContentVariants}>{data.username}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline">Email</Typography>
              <Typography {...subContentVariants}>{data.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline">Created At</Typography>
              <Typography {...subContentVariants}>{data.created_at}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline">Updated At</Typography>
              <Typography {...subContentVariants}>{data.updated_at}</Typography>
            </Grid>
          </Grid>
          <BackButton />
        </div>
      )}
    </Page>)
}
