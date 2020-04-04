import { makeStyles } from '@material-ui/core/styles';
import session from './Session';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
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

const serverHandler = async (url,method,body) => {
	let response;
	try {
		if (body && !(body instanceof FormData)) {
			if (body instanceof Event) {
				body = session.extract(body);
			} else {
				var data = new FormData();
				Object.entries(body).forEach(([k,v])=>data.append(k, v));
				body = data;
			}
		}
		const result = await fetch(url, {
			headers: {
				...(session.auth ? { 'Authorization': session.auth, 'Accept': 'application/json' } : {}),
				'X-Requested-With': 'xmlhttprequest',
			},
			method,
			body,
		});
		response = await result.json();
	} catch (error) {
		const e = encodeURIComponent((error+''));
		const u = encodeURIComponent((url+'').replace(session.baseUrl(''), ''));
		session.history.push(`/offline?reason=${e}&uri=${u}`);
		throw error;
	} finally {
		if (response.status !== 'Error') {
			return response;
		} else {
			session.error = response.message;
			throw session.error;
		}
	}
}


export { useStyles, serverHandler };