import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { appTitle } from 'main/Config';

export default function Footer({ children }) {
  return (<Box py={4}>
    {children}
    <Typography variant="body2" color="textSecondary" align="center">
      {appTitle}
    </Typography>
  </Box>)
}