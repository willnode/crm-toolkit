import React from 'react';
import ReactDOM from 'react-dom';
import App from './main/App';
import * as serviceWorker from './serviceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
	BrowserRouter as Router,
  } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Router forceRefresh={false} basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
  </React.StrictMode> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
