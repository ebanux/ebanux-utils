import LZString from 'lz-string';

class Session {
  get currentAccount() {
    return this.get('account');
  }

  get isAuthenticate() {
    return !!this.currentAccount;
  }

  get serverBaseUrl() {
    return process.env.SERVER_BASE_URL || process.env.REACT_APP_SERVER_BASE_URL || 'http://127.0.0.1:3000';
  }

  get apiBaseUrl() {
    return `${this.serverBaseUrl}/${this.apiBasePath}`;
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
      process.env.OAUTH_TOKEN_URL || process.env.REACT_APP_OAUTH_TOKEN_URL,
    );
  }

  get oauthUrl() {
    return this.get(
      'OAUTH_URL',
      process.env.OAUTH_URL || process.env.REACT_APP_OAUTH_URL,
    );
  }

  get oauthScope() {
    return this.get(
      'OAUTH_SCOPE',
      process.env.OAUTH_SCOPE || process.env.REACT_APP_OAUTH_SCOPE,
    );
  }

  set appClientId(value) {
    this.set('APP_CLIENT_ID', value);
  }

  set apiBasePath(value) {
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

  get(key, defaultValue) {
    const item = window.sessionStorage.getItem(LZString.compress(key));

    return (item === null) ? defaultValue : JSON.parse(LZString.decompress(item));
  }

  set(key, value) {
    try {
      window.sessionStorage.setItem(LZString.compress(key), LZString.compress(JSON.stringify(value)));
    } catch (e) {
      window.sessionStorage.clear();
    }
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
