import React, { Component } from 'react';
import propTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import { serverGet } from '../main/Helper';
import {useTheme} from '@material-ui/core/styles';
import Helmet from 'react-helmet';

function SEO({ title, description, image, url }) {
	return <Helmet>
		{/* General tags */}
		{title ? <title>{title}</title> : null}
		{description ? <meta name="description" content={description} /> : null}
		{image ? <meta name="image" content={image} /> : null}
		{url ? <link rel="canonical" href={url} /> : null}	{/* OpenGraph tags */}
		{url ? <meta property="og:url" content={url} /> : null}
		{title ? <meta property="og:title" content={title} /> : null}
		{description ? <meta property="og:description" content={description} /> : null}
		{image ? <meta property="og:image" content={image} /> : null}	{/* Twitter Card tags */}
		{image ? <meta name="twitter:card" content="summary_large_image" /> : null}
		{title ? <meta name="twitter:title" content={title} /> : null}
		{description ? <meta name="twitter:description" content={description} /> : null}
		{image ? <meta name="twitter:image" content={image} /> : null}
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
		return this.props.noStyle ? children : (
			<Container maxWidth={this.props.maxWidth}>
				<Box p={3} my={5} clone
					{...(this.props.center ? {
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						textAlign: 'center'
					} : {})}>
					<Paper>{children}</Paper>
				</Box>
			</Container>
		)
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
				this.state.status === 'loading' ? <Skeleton animation="wave" variant="rect" width="100%" height={200} /> :
					(this.state.status === 'ok' ? this.props.children :
						<this.ErrorPrompt />)
			}
		</this.Container>
	}
}

Page.propTypes = {
	dataCallback: propTypes.func,
	src: propTypes.string,
	noStyle: propTypes.bool,
	center: propTypes.bool,
}

export default Page;

export { SEO };