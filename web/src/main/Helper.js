import { makeStyles } from '@material-ui/core/styles';
import { serverUrl, uploadsUrl, baseUrl, imageAvatarUrl, appKey } from './Config';
import { Context, TemporaryContext } from './Contexts';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: (theme.zIndex.drawer + 1) + ' !important',
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
				body = extractForm(body);
			} else {
				var data = new FormData();
				Object.entries(body).forEach(([k, v]) => data.append(k, v));
				body = data;
			}
		}
		//if ()
		Context.set('fetching', true);
		const result = await fetch(url, {
			headers: {
				...((x => x ? { 'Authorization': x } : {})(Context.get('auth'))),
				'X-Requested-With': 'xmlhttprequest',
				'Accept': 'application/json',
			},
			method,
			body,
		});
		response = await result.json();
	} catch (error) {
		const e = encodeURIComponent((error + ''));
		const u = encodeURIComponent((url + '').replace(baseUrl, ''));
		history().push(`/offline?reason=${e}&uri=${u}`);
		throw error;
	} finally {
		Context.set('fetching', false);
		if (response && response.status === 'OK') {
			return response;
		} else {
			throw (response && response.message) || 'Unknown Error';
		}
	}
}

const extractForm = (event) => {
	event.preventDefault();
	return new FormData(event.target);
}

const doLogin = async (username, password, rememberme) => {
	Context.set('auth', 'Basic ' + btoa(username + ':' + password));
	try {
		const { login } = await serverGet('login');
		Context.set('login', login);
		const storage = rememberme ? localStorage : sessionStorage;
		storage.setItem(appKey + 'appauth', Context.get('auth'));
		storage.setItem(appKey + 'applogin', JSON.stringify(login));
		history().push('/' + login.role);
		return login;
	} catch (e) {
		Context.set('auth', null);
		throw e;
	}
}

const doLogout = () => {
	Context.set('auth', null);
	Context.set('login', null);
	localStorage.clear();
	sessionStorage.clear();
	history().push('/login');
}

const getAvatarUrl = (avatar) => {
	avatar = avatar === undefined ? (x => x && x.avatar)(login()) : avatar;
	return avatar ? uploadsUrl + '/avatar/' + avatar : imageAvatarUrl
}

const serverGet = async (url) => await serverHandler(prefixBaseUrl(url), 'get');
const serverPost = async (url, body) => await serverHandler(prefixBaseUrl(url), 'post', body);
const serverDelete = async (url) => await serverHandler(prefixBaseUrl(url), 'delete');
const prefixBaseUrl = url => `${serverUrl}/${url}`;
const prefixRole = url => `${login().role}/${url}`;
const history = () => TemporaryContext.history;
const login = () => Context.get('login');
const setError = (s) => Context.set('error', s);
const setMessage = (s) => Context.set('message', s);
const doReload = () => {
	Context.set('counter', Context.get('counter') + 1);
};

const popMessages = () => {
	 {
		setError(null);
	}
	{
		setMessage(null);
	}
}

export {
	useStyles, serverHandler,
	extractForm, getAvatarUrl,
	serverGet, serverPost,
	serverDelete, prefixRole,
	setError, setMessage,
	history, login, doLogin,
	doLogout, doReload,
	popMessages,
};