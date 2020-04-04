import React, { Component } from 'react';
import session from '../main/Session';
import propTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

const ErrorPrompt = () => (
	<>
		<Typography variant="h2" gutterBottom>Error :(</Typography>
		<Typography variant="body1">Sorry you might be offline. Check your connection.</Typography>
	</>
)
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
	render() {
		switch (this.state.status) {
			case 'loading': return <Skeleton />;
			case 'ok': return (this.props.noStyle ? this.props.children :
				<Container>
					<Box p={3} my={5} clone textAlign={this.props.center ? 'center' : null}>
						<Paper>{this.props.children}</Paper>
					</Box>
				</Container>
			)
			case 'error': default: return (this.props.noStyle ? <ErrorPrompt /> :
				<Container>
					<Box p={3} my={5} clone>
						<Paper><ErrorPrompt /></Paper>
					</Box>
				</Container>
			)
		}
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