import React from 'react';
import axios from 'axios';
import session from './sessionStorage';
import { request, toQueryParams } from './request';

import classes from './spinner.css';

export function getOrRefreshToken() {
  const credentials = session.get('credentials');
  const authRequest = axios.create({ baseURL: session.serverBaseUrl });
  const options = { url: session.oauthTokenUrl, method: 'POST' };

  if (session.oauthTokenUrl.match(/oauth2\/token/)) {
    options.data = toQueryParams(credentials);
    options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  } else {
    options.data = credentials;
    options.headers = { 'Content-Type': 'application/json' };
  }

  return authRequest(options)
    .then((response) => {
      session.set('credentials', {
        grant_type: 'refresh_token',
        refresh_token: response.data.refresh_token,
        client_id: session.appClientId,
      });

      return response.data;
    }).catch((err) => {
      session.del('credentials');
      session.del('account');
      const message = err.response ? err.response.data.message : err.message;
      throw Error(message);
    });
}

export function authWithAuthCode(authCode) {
  session.set('credentials', {
    grant_type: 'authorization_code',
    redirect_uri: session.appBaseUrl,
    client_id: session.appClientId,
    code: authCode,
  });

  //  Get Current user
  const options = { url: session.currentUserServicePath, method: 'GET' }

  return request(options).then((response) => {
    const user = response.result || response;
    session.set('account', user);
    return user;
  }).catch((err) => {
    session.del('credentials');
    session.del('account');
    const message = err.response ? err.response.data.message : err.message;
    throw Error(message);
  });
}

export function startAuthorizationFlow() {
  const data = {
    redirect_uri: session.appBaseUrl,
    client_id: session.appClientId,
    scope: session.oauthScope,
    response_type: 'code',
  };
  window.location.href = `${session.oauthUrl}?${toQueryParams(data)}`;
}

export function injectAuthenticationFlow(WrappedComponent) {
  return (props) => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('code')) {
      const authCode = urlParams.get('code');
      authWithAuthCode(authCode).then(() => window.location.replace(session.appBaseUrl));
    } else if (!session.isAuthenticate) {
      startAuthorizationFlow();
    } else {
      return React.createElement(WrappedComponent, { user: session.currentAccount, ...props });
    }

    return (
      <div className={classes.spinner_container}>
        <div className={classes.loading_spinner}></div>
      </div>
    )
  }
}
