import React, { Component } from 'react';
import session from '../main/Session';
import propTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

class Page extends Component {
	constructor() {
		super()
		this.state = {
			status: 'loading'
		}
		this.mounted = false;
	}
	componentDidMount() {
		if (this.props.src) {
			const fetch = this.props.notByRole ? session.get : session.getByRole;
			fetch(this.props.src).then(data => {
				if (this.mounted) {
					this.props.dataCallback(data);
					this.setState({
						status: 'ok'
					});
				}
			}).catch(_ => this.setState({
				status: 'error'
			}));
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
		return this.props.noStyle ? children :(
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
				this.state.status === 'loading' ? <Skeleton animation="wave" variant="rect" width="100%" height={200}/> :
				this.state.status === 'ok' ? this.props.children :
				<this.ErrorPrompt />
			}
		</this.Container>
	}
}

Page.propTypes = {
	dataCallback: propTypes.func,
	src: propTypes.string,
	notByRole: propTypes.bool,
	noStyle: propTypes.bool,
	center: propTypes.bool,
}

export default Page;