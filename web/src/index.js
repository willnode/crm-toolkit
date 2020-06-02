import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './media/style.css';
import App from './main/App';
import { publicUrl } from './main/Config';
import { Context } from './main/Contexts';
import { ErrorBoundary } from './static/offline';

function GenerateTheme(theme) {
  return createMuiTheme({
    overrides: {
      MuiFormLabel: {
        asterisk: {
          display: "none", // Disable asterisk on required
        }
      }
    },
    palette: {
      type: theme, // Autochoose dark mode
    },
  })
}

function MainApp() {
  const theme = Context.bind('theme', React.useState('light'))[0];
  const generated = React.useMemo(() => GenerateTheme(theme), [theme]);

  return (
    <ThemeProvider theme={generated}>
      <CssBaseline />
      <BrowserRouter forceRefresh={false} basename={publicUrl}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}

let root = document.getElementById('root');
(root.hasChildNodes() ? hydrate : render)(<MainApp />, root);
