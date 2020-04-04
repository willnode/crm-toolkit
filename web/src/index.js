import ReactDOM from 'react-dom';
import React, { StrictMode } from 'react';
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, useMediaQuery } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
import { baseUrl } from './main/Config';
import App from './main/App';

function MainApp() {
  const prefersDarkMode = false;// useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
       <CssBaseline />
        <BrowserRouter forceRefresh={false} basename={baseUrl}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
