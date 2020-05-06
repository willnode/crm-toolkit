import React from 'react';
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
    {image && <meta name="thumbnail" content={image} />}
    {url && <link rel="canonical" href={url} />}
    <meta name="theme-color" content={useTheme().palette.primary.main} />
    {/* OpenGraph tags */}
    {url && <meta property="og:url" content={url} />}
    {title && <meta property="og:title" content={title} />}
    {description && <meta property="og:description" content={description} />}
    {image && <meta property="og:image" content={image} />}
    {/* Twitter Card tags */}
    {image && <meta name="twitter:card" content="summary_large_image" />}
    {title && <meta name="twitter:title" content={title} />}
    {description && <meta name="twitter:description" content={description} />}
    {image && <meta name="twitter:image" content={image} />}
  </Helmet>
}

const ErrorPage = () => {
  return (
    <div>
      <Typography variant="h2" gutterBottom>Error :(</Typography>
      <Typography variant="body1">Sorry you might be offline. Check your connection.</Typography>
    </div>
  )
}

const InnerPage = (({ src, className, maxWidth, children, dataCallback, ...props }) => {
  const isMounted = React.useRef(true);
  const [status, setStatus] = React.useState(src ? 'loading' : 'ok');
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (src) {
      (serverGet(src)
        .then((data) => isMounted.current && [
          setData(data), dataCallback && dataCallback(data), setStatus('ok')
        ])
        .catch((error) => isMounted.current && [setData(error), setStatus('error')])
      )
    } else {
      setData(null);
      setStatus('ok');
    }
    return () => isMounted.current = false;
  }, [src]);
  if (status === 'loading') {
    let indicator = <CircularProgress style={{ margin: 'auto' }} />;
    return !className ? <div className="paper loading">{indicator}</div> : (
      <Container maxWidth={maxWidth}>
        <Paper className="paper loading" {...props}>{indicator}</Paper>
      </Container>
    );
  } else {
    let page = status === 'error' ? <ErrorPage /> : (
      typeof children === "function" ? children(data) : children
    );
    return className ? (
      <Container maxWidth={maxWidth}>
        <Paper className={className} {...props}>{page}</Paper>
      </Container>
    ) : page;
  }
});

const Page = (({ src, children, ...props }) => {
  return <InnerPage key={src || ''} src={src} {...props}>{children}</InnerPage>;
})

export { Page, SEO };