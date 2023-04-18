## Ebanux-Utils module

### Installation:

**Install from the command line:**
    
    $ npm install @ebanux/ebanux-utils

**Install via package.json:**

    "@ebanux/ebanux-utils": "^1.0.0"

### Environments:

    AMZ_WS_COGNITO_CLIENT_ID=*********************
    
    SERVER_BASE_URL=http://my-backend.com
    API_BASE_PATH=api/v2.0
    CURRENT_USER_SERVICE_PATH=users/me
    
    OAUTH_SCOPE=aws.cognito.signin.user.admin openid
    OAUTH_TOKEN_URL=https://ebanux-dev.auth.us-east-1.amazoncognito.com/oauth2/token

    SIGN_IN_URL=https://ebanux-dev.auth.us-east-1.amazoncognito.com/login
    SIGN_UP_URL=https://ebanux-dev.auth.us-east-1.amazoncognito.com/signup
    SIGN_OUT_URL=https://ebanux-dev.auth.us-east-1.amazoncognito.com/logout
    
    SIGN_IN_REDIRECT_URI=SELF_FULL_URI or SELF_FULL_URL or SELF_BASE_URL or https://my-app.com
    SIGN_OUT_REDIRECT_URI=SELF_FULL_URI or SELF_FULL_URL or SELF_BASE_URL or https://my-app.com
    