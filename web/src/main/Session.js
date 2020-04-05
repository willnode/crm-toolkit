import {serverHandler} from  './Helper';
import { imageAvatarUrl, uploadsUrl } from './Config';

const serverUrl = process.env.NODE_ENV === 'production' ? 'YOUR PRODUCTION URL' : 'http://localhost:4000';

const session = {
	auth: null,
	login: null,
	history: null,
	counter: null,
	message: null,
	error: null,
	reload: () => session.setCounter(Math.random()),
	getAvatarUrl: (avatar) => {
		avatar = avatar === undefined ? (session.login && session.login.avatar) : avatar;
		return avatar ? uploadsUrl +'avatar/'+avatar : imageAvatarUrl
	},
	setMessage(v) {
		session.message = v;
		session.reload();
	},
	setError(v) {
		session.error = v;
		session.reload();
	},
	baseUrl: url => `${serverUrl}/${url}`,
	baseUrlByRole: url => `${serverUrl}/${session.login.role}/${url}`,
	extract(event) {
		event.preventDefault();
		return new FormData(event.target);
	},
	get: async (url) => await serverHandler(session.baseUrl(url), 'get'),
	post: async (url, body) => await serverHandler(session.baseUrl(url), 'post', body),
	delete: async (url) => await serverHandler(session.baseUrl(url), 'delete'),
	getByRole: async (url) => await serverHandler(session.baseUrlByRole(url), 'get'),
	postByRole: async (url, body) => await serverHandler(session.baseUrlByRole(url), 'post', body),
	deleteByRole: async (url) => await serverHandler(session.baseUrlByRole(url), 'delete'),
}
if (window.sessionStorage.getItem('appauth')) {
	session.auth = window.sessionStorage.getItem('appauth');
	session.login = JSON.parse(window.sessionStorage.getItem('applogin'));
} else if (window.localStorage.getItem('appauth')) {
	session.auth = window.localStorage.getItem('appauth');
	session.login = JSON.parse(window.localStorage.getItem('applogin'));
}
window.session = session;
window.callbacks = [];
export default session;