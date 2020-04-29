import React from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { history, getQueryParam } from '../main/Helper';
import { Page, SEO } from '../widget/page';
import { isProduction } from 'main/Config';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }

  componentDidCatch(error) {
    this.setState({ err: error + '' });
  }

  render() {
    if (isProduction && this.state.err) {
      return <Offline reason={this.state.err}/>;
    }
    return this.props.children;
  }
}

export default function Offline({ reason }) {
  reason = (getQueryParam('reason') || reason || '');
  let uri = (getQueryParam('uri') || '').replace(/\?.+/, '');
  let message = reason.includes('fetch') ? 'Sorry, we can\'t reach to server. Please check your connection.' :
    reason.includes('Unexpected') ? 'Sorry, we have problems in our server. Try again later.' :
      'Sorry, there\'s an unexpected error going on. Please try again later.';
  return (
    <Page className="paper center" maxWidth="xs">
      <SEO title="Offline :(" />
      <Typography variant="h2" gutterBottom>Error :(</Typography>
      <Typography variant="body1" gutterBottom>{message}</Typography>
      <Button variant="contained" className="block-button" onClick={() => history().goBack()}>Go Back</Button>
      <Typography variant="overline" color="textSecondary">{reason}</Typography>
      <Typography variant="overline" color="textSecondary">{uri}</Typography>
    </Page>)
}

export { ErrorBoundary }
