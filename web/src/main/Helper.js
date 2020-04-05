import { makeStyles } from '@material-ui/core/styles';
import session from './Session';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex:( theme.zIndex.drawer + 1) + ' !important',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerContainer: {
		overflow: 'auto',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	blockButton: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		textAlign: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const serverHandler = async (url, method, body) => {
	let response;
	try {
		if (body && !(body instanceof FormData)) {
			if (body instanceof Event) {
				body = session.extract(body);
			} else {
				var data = new FormData();
				Object.entries(body).forEach(([k, v]) => data.append(k, v));
				body = data;
			}
		}
		session.setFetching(true);
		const result = await fetch(url, {
			headers: {
				...(session.auth ? { 'Authorization': session.auth } : {}),
				'X-Requested-With': 'xmlhttprequest',
				'Accept': 'application/json',
			},
			method,
			body,
		});
		response = await result.json();
	} catch (error) {
		const e = encodeURIComponent((error + ''));
		const u = encodeURIComponent((url + '').replace(session.baseUrl(''), ''));
		session.history.push(`/offline?reason=${e}&uri=${u}`);
		throw error;
	} finally {
		session.setFetching(false);
		if (response.status === 'OK') {
			return response;
		} else {
			session.error = response.message;
			throw session.error;
		}
	}
}


export { useStyles, serverHandler };