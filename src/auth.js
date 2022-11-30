import React from 'react';
import axios from 'axios';
import session from './sessionStorage';
import { toQueryParams } from './request';

axios.defaults.baseURL = session.serverBaseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

export function getOrRefreshToken() {
  const credentials = session.get('credentials');

  const authRequest = axios.create();
  const options = {
    url: session.oauthTokenUrl,
    method: 'POST',
    data: credentials,
  };

  return authRequest(options)
    .then((response) => {
      session.set('credentials', {
        grant_type: 'refresh_token',
        refresh_token: response.data.refresh_token,
        client_id: session.appClientId,
      });

      return response.data;
    }).catch((err) => {
      // session.clear();
      const message = err.response ? err.response.data.message : err.message;
      throw Error(message);
    });
};

export function authWithAuthCode(authCode) {
  session.set('credentials', {
    grant_type: 'authorization_code',
    redirect_uri: session.appBaseUrl,
    client_id: session.appClientId,
    code: authCode,
  });
}

export function startAuthorizationFlow() {
  const data = {
    redirect_uri: session.appBaseUrl,
    client_id: session.appClientId,
    scope: session.authorizationScope,
  };
  window.location.href = `${session.oauthUrl}?${toQueryParams(data)}`;
}
