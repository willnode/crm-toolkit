import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { serverGet } from '../main/Helper';
import { useTheme } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';

function SEO({ title, description, image, url }) {
  return <Helmet>
    {/* General tags */}
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {image && <meta name="image" content={image} />}
    {url && <link rel="canonical" href={url} />}	{/* OpenGraph tags */}
    {url && <meta property="og:url" content={url} />}
    {title && <meta property="og:title" content={title} />}
    {description && <meta property="og:description" content={description} />}
    {image && <meta property="og:image" content={image} />}	{/* Twitter Card tags */}
    {image && <meta name="twitter:card" content="summary_large_image" />}
    {title && <meta name="twitter:title" content={title} />}
    {description && <meta name="twitter:description" content={description} />}
    {image && <meta name="twitter:image" content={image} />}
    <meta name="theme-color" content={useTheme().palette.primary.main} />
  </Helmet>
}

class Page extends Component {
  state = {
    status: 'loading'
  }
  constructor() {
    super()
    this.mounted = false;
  }
  componentDidMount() {
    if (this.props.src) {
      serverGet(this.props.src).then(data => {
        if (this.mounted) {
          this.props.dataCallback(data);
          this.setState({
            status: 'ok'
          });
        }
      }).catch(e => {
        console.log(e);
        this.setState({
          status: 'error'
        })
      });
    } else {
      this.setState({
        status: 'ok'
      })
    }
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  Container = ({ children }) => {
    let { className, maxWidth, props } = this.props;
    if (this.state.status === 'loading') {
      return !className ? <div className="paper loading">{children}</div> : (
        <Container maxWidth={maxWidth}>
            <Paper className="paper loading" {...props}>{children}</Paper>
        </Container>
      )
    } else {
      return !className ? children : (
        <Container maxWidth={maxWidth}>
            <Paper className={className} {...props}>{children}</Paper>
        </Container>
      )
    }
  }
  ErrorPrompt = () => (
    <>
      <Typography variant="h2" gutterBottom>Error :(</Typography>
      <Typography variant="body1">Sorry you might be offline. Check your connection.</Typography>
    </>
  )
  render() {
    return <this.Container>
      {
        this.state.status === 'loading' ? <CircularProgress style={{ margin: 'auto'}}/> :
          (this.state.status === 'ok' ? this.props.children :
            <this.ErrorPrompt />)
      }
    </this.Container>
  }
}

export default Page;

export { SEO };