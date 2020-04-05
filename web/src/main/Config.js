
const appKey = 'crmtoolkit';
const appTitle = 'CRM Toolkit';
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = process.env.PUBLIC_URL;
const serverUrl = 'http://localhost:4000';
const uploadsUrl = 'http://localhost:4000/uploads/';
const imageAvatarUrl = process.env.PUBLIC_URL + '/assets/user.png';
const imageBrandUrl = process.env.PUBLIC_URL + '/assets/logo.png';
const imageNavbarUrl = process.env.PUBLIC_URL + '/assets/logo-navbar.png';

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
