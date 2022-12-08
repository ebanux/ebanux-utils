import LZString from 'lz-string';

class Session {
  _axiosInstance = null;

  get currentAccount() {
    return this.get('account');
  }

  get isAuthenticate() {
    return !!this.get('credentials');
  }

  get serverBaseUrl() {
    return process.env.SERVER_BASE_URL || process.env.REACT_APP_SERVER_BASE_URL || 'http://127.0.0.1:3000';
  }

  get apiBaseUrl() {
    return `${this.serverBaseUrl}/${this.apiBasePath || ''}`;
  }

  get appBaseUrl() {
    return window.location.href.replace(/\?.*$/, '').replace(/\/$/, '');
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
