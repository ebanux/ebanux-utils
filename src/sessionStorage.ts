// @ts-ignore
import LZString from 'lz-string';
import { AxiosInstance } from 'axios';

class Session {
  _axiosInstance: AxiosInstance | null = null;

  get currentUser(): any {
    return this.get('user');
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  get isAuthenticating(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code');
  }

  get serverBaseUrl(): string {
    return process.env.SERVER_BASE_URL || process.env.REACT_APP_SERVER_BASE_URL || 'http://127.0.0.1:3000';
  }

  get apiBaseUrl(): string {
    return `${this.serverBaseUrl}/${this.apiBasePath || ''}`;
  }

  get appBaseUrl(): string {
    return window.location.href.replace(/(https?:\/\/[^?#/]+).*/, '$1');
  }

  get appClientId(): string {
    const defaultValue = process.env.AMZ_WS_COGNITO_CLIENT_ID
      || process.env.AWS_COGNITO_CLIENT_ID
      || process.env.REACT_APP_AWS_COGNITO_CLIENT_ID;
    return this.get('APP_CLIENT_ID', defaultValue);
  }

  get apiBasePath(): string {
    const defaultValue = process.env.API_BASE_PATH
      || process.env.REACT_APP_API_BASE_PATH;
    return this.get('API_BASE_PATH', defaultValue);
  }

  get apiRequestTimeout(): number {
    const defaultValue = process.env.API_REQUEST_TIMEOUT
      || process.env.REACT_APP_API_REQUEST_TIMEOUT;
    return this.get('API_REQUEST_TIMEOUT', defaultValue ? parseInt(defaultValue, 10) : undefined);
  }

  get oauthTokenUrl(): string {
    const defaultValue = process.env.OAUTH_TOKEN_URL
      || process.env.REACT_APP_OAUTH_TOKEN_URL
      || `${this.apiBaseUrl}/oauth/token`;
    return this.get('OAUTH_TOKEN_URL', defaultValue);
  }

  get signInUrl(): string {
    const defaultValue = process.env.SIGN_IN_URL
      || process.env.REACT_APP_SIGN_IN_URL
      || `${this.apiBaseUrl}/oauth/authorize`;
    return this.get('SIGN_IN_URL', defaultValue);
  }

  get signUpUrl(): string {
    const defaultValue = process.env.SIGN_UP_URL
      || process.env.REACT_APP_SIGN_UP_URL
      || `${this.apiBaseUrl}/oauth/signup`;
    return this.get('SIGN_UP_URL', defaultValue);
  }

  get signOutUrl(): string {
    const defaultValue = process.env.SIGN_OUT_URL
      || process.env.REACT_APP_SIGN_OUT_URL
      || `${this.apiBaseUrl}/oauth/logout`;
    return this.get('SIGN_UP_URL', defaultValue);
  }

  get signInRedirectUri(): string {
    const defaultValue = process.env.SIGN_IN_REDIRECT_URI
      || process.env.REACT_APP_SIGN_IN_REDIRECT_URI
      || 'SELF_BASE_URL';
    const value = this.get('SIGN_IN_REDIRECT_URI', defaultValue);
    return this.parseSelfURI(value);
  }

  get signOutRedirectUri(): string {
    const defaultValue = process.env.SIGN_OUT_REDIRECT_URI
      || process.env.REACT_APP_SIGN_OUT_REDIRECT_URI
      || 'SELF_BASE_URL';
    const value = this.get('SIGN_OUT_REDIRECT_URI', defaultValue);

    return this.parseSelfURI(value);
  }

  get oauthScope(): string {
    const defaultValue = process.env.OAUTH_SCOPE
      || process.env.REACT_APP_OAUTH_SCOPE
      || 'aws.cognito.signin.user.admin email openid';
    return this.get('OAUTH_SCOPE', defaultValue);
  }

  get currentUserServicePath(): string {
    const defaultValue = process.env.CURRENT_USER_SERVICE_PATH
      || process.env.REACT_APP_CURRENT_USER_SERVICE_PATH
      || 'users/me';
    return this.get('CURRENT_USER_SERVICE_PATH', defaultValue);
  }

  get axiosInstance(): AxiosInstance | null {
    return this._axiosInstance;
  }

  set appClientId(value: string) {
    this.set('APP_CLIENT_ID', value);
  }

  set apiBasePath(value: string) {
    this.axiosInstance = null;
    this.set('API_BASE_PATH', value);
  }

  set apiRequestTimeout(value: number) {
    this.set('API_REQUEST_TIMEOUT', value);
  }

  set oauthTokenUrl(value: string) {
    this.set('OAUTH_TOKEN_URL', value);
  }

  set signInUrl(value: string) {
    this.set('SIGN_IN_URL', value);
  }

  set signUpUrl(value: string) {
    this.set('SIGN_UP_URL', value);
  }

  set oauthScope(value: string) {
    this.set('OAUTH_SCOPE', value);
  }

  set currentUserServicePath(value: string) {
    this.set('CURRENT_USER_SERVICE_PATH', value);
  }

  set axiosInstance(value: AxiosInstance | null) {
    this._axiosInstance = value;
  }

  get(key: string, defaultValue?: any, remove: boolean = false): any {
    const item = window.sessionStorage.getItem(LZString.compress(key));
    remove && this.del(key);
    return (item === null) ? defaultValue : JSON.parse(LZString.decompress(item));
  }

  set(key: string, value: any) {
    window.sessionStorage.setItem(LZString.compress(key), LZString.compress(JSON.stringify(value)));
  }

  del(key: string) {
    window.sessionStorage.removeItem(LZString.compress(key));
  }

  clear() {
    window.sessionStorage.clear();
  }

  parseSelfURI(value: string) {
    const requestUri = window.location.href;

    if (value === 'SELF_FULL_URI') return requestUri;
    if (value === 'SELF_FULL_URL') return requestUri.replace(/(https?:\/\/[^?#]+).*/, '$1');
    if (value === 'SELF_BASE_URL') return requestUri.replace(/(https?:\/\/[^?#/]+).*/, '$1');

    return value;
  }
}

const session = new Session();

export default session;
