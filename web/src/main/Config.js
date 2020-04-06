
const appKey = 'crmtoolkit';
const appTitle = 'CRM Toolkit';
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = process.env.PUBLIC_URL;
const serverUrl = 'http://localhost:4000';
const uploadsUrl = serverUrl + '/uploads';
const imageAvatarUrl = baseUrl + '/assets/user.png';
const imageBrandUrl = baseUrl + '/assets/logo.png';
const imageNavbarUrl = baseUrl + '/assets/logo-navbar.png';

export {
	appKey,
	appTitle,
	isProduction,
	baseUrl,
	serverUrl,
	uploadsUrl,
	imageAvatarUrl,
	imageBrandUrl,
	imageNavbarUrl,
}
