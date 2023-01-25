import LZString from 'lz-string';

class Session {
  _axiosInstance = null;

  get currentAccount() {
    return this.get('account');
  }

  get isAuthenticated() {
    return !!this.get('credentials');
  }

  get isAuthenticate() {
    // TODO: Deprecate...
    return this.isAuthenticated;
  }

  get isAuthenticating() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code');
  }

  get serverBaseUrl() {
    return process.env.SERVER_BASE_URL || process.env.REACT_APP_SERVER_BASE_URL || 'http://127.0.0.1:3000';
  }

  get apiBaseUrl() {
    return `${this.serverBaseUrl}/${this.apiBasePath || ''}`;
  }

  get appBaseUrl() {
    return window.location.href.replace(/(https?:\/\/[^?#/]+).*/, '$1');
  }

  get appClientId() {
    return this.get(
      'APP_CLIENT_ID',
      process.env.AWS_COGNITO_CLIENT_ID || process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
    )
  }

  get apiBasePath() {
    return this.get(
      'API_BASE_PATH',
      process.env.API_BASE_PATH || process.env.REACT_APP_API_BASE_PATH,
    );
  }

  get oauthTokenUrl() {
    return this.get(
      'OAUTH_TOKEN_URL',
      process.env.OAUTH_TOKEN_URL || process.env.REACT_APP_OAUTH_TOKEN_URL || `${this.apiBaseUrl}/oauth/token`,
    );
  }

  get oauthUrl() {
    return this.get(
      'OAUTH_URL',
      process.env.OAUTH_URL || process.env.REACT_APP_OAUTH_URL || `${this.apiBaseUrl}/oauth/authorize`
    );
  }

  get oauthScope() {
    return this.get(
      'OAUTH_SCOPE',
      process.env.OAUTH_SCOPE || process.env.REACT_APP_OAUTH_SCOPE || 'aws.cognito.signin.user.admin email openid',
    );
  }

  get oauthRedirectUri() {
    const requestUri = window.location.href;
    const value = this.get(
      'OAUTH_REDIRECT_URI',
      process.env.OAUTH_REDIRECT_URI || process.env.REACT_APP_OAUTH_REDIRECT_URI || 'SELF_BASE_URL',
    );

    if (value === 'SELF_FULL_URI') return requestUri;
    if (value === 'SELF_FULL_URL') return requestUri.replace(/(https?:\/\/[^?#]+).*/, '$1');
    if (value === 'SELF_BASE_URL') return requestUri.replace(/(https?:\/\/[^?#/]+).*/, '$1');

    return value;
  }

  get logoutUrl() {
    return this.get(
      'LOGOUT_URL',
      process.env.LOGOUT_URL || process.env.REACT_APP_LOGOUT_URL || `${this.apiBaseUrl}/oauth/logout`,
    );
  }

  get logoutRedirectUri() {
    return this.get(
      'LOGOUT_REDIRECT_URL',
      process.env.LOGOUT_REDIRECT_URL || process.env.REACT_APP_LOGOUT_REDIRECT_URL || this.oauthRedirectUri,
    );
  }

  get currentUserServicePath() {
    return this.get(
      'CURRENT_USER_SERVICE_PATH',
      process.env.CURRENT_USER_SERVICE_PATH || process.env.REACT_APP_CURRENT_USER_SERVICE_PATH || 'users/me',
    );
  }

  get axiosInstance() {
    return this._axiosInstance;
  }

  set appClientId(value) {
    this.set('APP_CLIENT_ID', value);
  }

  set apiBasePath(value) {
    this.axiosInstance = undefined;
    this.set('API_BASE_PATH', value);
  }

  set oauthTokenUrl(value) {
    this.set('OAUTH_TOKEN_URL', value);
  }

  set oauthUrl(value) {
    this.set('OAUTH_URL', value);
  }

  set oauthScope(value) {
    this.set('OAUTH_SCOPE', value);
  }

  set currentUserServicePath(value) {
    this.set('CURRENT_USER_SERVICE_PATH', value);
  }

  set axiosInstance(value) {
    this._axiosInstance = value;
  }

  get(key, defaultValue) {
    const item = window.sessionStorage.getItem(LZString.compress(key));

    return (item === null) ? defaultValue : JSON.parse(LZString.decompress(item));
  }

  set(key, value) {
    window.sessionStorage.setItem(LZString.compress(key), LZString.compress(JSON.stringify(value)));
  }

  del(key) {
    window.sessionStorage.removeItem(LZString.compress(key));
  }

  clear() {
    window.sessionStorage.clear();
  }
}

const session = new Session();

export default session;
