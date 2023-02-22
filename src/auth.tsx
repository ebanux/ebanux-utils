import React from 'react';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import session from './sessionStorage';
import cookies from './cookiesStorage';
import messaging from './messaging';
import { request, toQueryParams } from './request';

export function getOrRefreshToken(): Promise<any> {
  const credentials: any = session.get('credentials');
  const authRequest: AxiosInstance = axios.create({ baseURL: session.serverBaseUrl });
  const options: AxiosRequestConfig = { url: session.oauthTokenUrl, method: 'POST' };

  if (session.oauthTokenUrl.match(/oauth2\/token/)) {
    options.data = toQueryParams(credentials);
    options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  } else {
    options.data = credentials;
    options.headers = { 'Content-Type': 'application/json' };
  }

  return authRequest(options)
    .then((response) => {
      const { refresh_token } = session.get('credentials', {});
      session.set('credentials', {
        grant_type: 'refresh_token',
        refresh_token: response.data.refresh_token || refresh_token,
        client_id: session.appClientId,
      });

      return response.data;
    }).catch((err) => {
      session.del('credentials');
      session.del('user');
      const message = err.response ? err.response.data.message : err.message;
      throw Error(message);
    });
}

export function authWithAuthCode(authCode: string): Promise<any> {
  session.set('credentials', {
    grant_type: 'authorization_code',
    redirect_uri: session.oauthRedirectUri,
    client_id: session.appClientId,
    code: authCode,
  });

  //  Get Current user
  const options = { url: session.currentUserServicePath, method: 'GET' }

  return request(options).then((response: any) => {
    const user = response.result || response;
    session.set('user', user);
    cookies.set('user', user);
    return user;
  }).catch((err: any) => {
    session.del('credentials');
    session.del('user');
    cookies.del('user');
    throw err;
  });
}

export function startAuthorizationFlow() {
  const data = {
    redirect_uri: session.oauthRedirectUri,
    client_id: session.appClientId,
    scope: session.oauthScope,
    response_type: 'code',
  };
  window.location.href = `${session.oauthUrl}?${toQueryParams(data)}`;
}

export function logout() {
  const { logoutUrl, logoutRedirectUri, appClientId } = session;
  const data = {
    logout_uri: logoutRedirectUri,
    client_id: appClientId,
  };

  session.clear();
  window.location.href = `${logoutUrl}?${toQueryParams(data)}`;
}

export function injectAuthenticationFlow(WrappedComponent: any) {
  return (props: any) => {
    if (session.isAuthenticating) {
      const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
      const authCode: string | null = urlParams.get('code');
      authWithAuthCode(authCode as string).then(() => window.location.replace(session.oauthRedirectUri));
    } else if (!session.isAuthenticated) {
      startAuthorizationFlow();
    } else {
      return React.createElement(WrappedComponent, { user: session.currentUser, ...props });
    }

    if (messaging.exists('startWaiting')) {
      messaging.emit('startWaiting');
      return <div />
    }

    return (
      <div className="spinner_container">
        <div className="loading_spinner">
        </div>
      </div>
    )
  }
}

const AuthenticatorInternal = ({ children, user }: any) => {
  return <>{typeof children === 'function' ? children({ user }) : children}</>;
}

export const Authenticator = injectAuthenticationFlow(AuthenticatorInternal)