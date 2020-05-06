import React from 'react';
import Typography from '@material-ui/core/Typography';
import { appTitle } from '../main/Config';

export function FooterComponent({ children }) {
  return (<div className="layout-footer">
    {children}
    <Typography variant="body2" color="textSecondary" align="center">
      {appTitle}
    </Typography>
  </div>)
}