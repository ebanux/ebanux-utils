## Ebanux-Utils module

### Installation:

**Install from the command line:**
    
    $ npm install @ebanux/ebanux-utils

**Install via package.json:**

    "@ebanux/ebanux-utils": "^1.0.0"

### Environments:

    AWS_COGNITO_CLIENT_ID=*********************
    
    SERVER_BASE_URL=http://my-backend.com
    API_BASE_PATH=api/v2.0
    CURRENT_USER_SERVICE_PATH=users/me
    
    OAUTH_URL=https://ebanux-dev.auth.us-east-1.amazoncognito.com/login
    OAUTH_SCOPE=aws.cognito.signin.user.admin openid
    OAUTH_TOKEN_URL=https://ebanux-dev.auth.us-east-1.amazoncognito.com/oauth2/token
    OAUTH_REDIRECT_URI=SELF_FULL_URI or SELF_FULL_URL or SELF_BASE_URL or https://my-app.com

    LOGOUT_URL=https://ebanux-dev.auth.us-east-1.amazoncognito.com/logout
    LOGOUT_REDIRECT_URI=SELF_FULL_URI or SELF_FULL_URL or SELF_BASE_URL or https://my-app.com
    