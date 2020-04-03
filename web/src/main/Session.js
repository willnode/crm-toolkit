

const serverUrl = process.env.NODE_ENV === 'production' ? 'YOUR  PRODUCTION URL' : 'http://localhost:8080';

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
				...(session.auth ? { 'Authorization': session.auth, 'Accept': 'application/json' } : {})
			},
			method,
			body,
		});
		response = await result.json();
	} catch (error) {
		session.history.push('/offline?reason='+encodeURIComponent(error));
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

const session = {
	auth: null,
	login: null,
	history: null,
	counter: null,
	message: null,
	error: null,
	formatRupiah: ((formatter) => (rp) => formatter.format(rp))(new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
	  })),
	formatID: (id) => 'SE20'+(id+'').padStart(5, '0'),
	reload: () => session.setCounter(Math.random()),
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