
const appKey = 'crmtoolkit';
const appTitle = 'CRM Toolkit';
const isProduction = process.env.NODE_ENV === 'production';
const publicUrl = process.env.PUBLIC_URL;
const serverUrl = 'http://localhost:4000';
const uploadsUrl = serverUrl + '/uploads';
const imageAvatarUrl = publicUrl + '/assets/user.png';
const imageBrandUrl = publicUrl + '/assets/logo.png';
const imageNavbarUrl = publicUrl + '/assets/logo-navbar.png';

export {
  appKey,
  appTitle,
  isProduction,
  publicUrl,
  serverUrl,
  uploadsUrl,
  imageAvatarUrl,
  imageBrandUrl,
  imageNavbarUrl,
}
