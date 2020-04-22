import React from 'react';
import Typography from '@material-ui/core/Typography';
import { appTitle } from 'main/Config';

export default function Footer({ children }) {
  return (<div class="layout-footer">
    {children}
    <Typography variant="body2" color="textSecondary" align="center">
      {appTitle}
    </Typography>
  </div>)
}