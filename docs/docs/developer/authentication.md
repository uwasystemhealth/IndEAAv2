# Authentication

## Frontend

### Login

#### Reauthenticate with LocalStorage

The `token` is stored in the localStorage. The user is reauthenticated everytime the application is loaded. The expiry of the token can be seen in `base.py`.

???+ warning "When does the token expire?"
    Let's say the expiry of the token lasts for 1 day. Because of the reauthentication everytime the application is loaded, as long as someone logs in before the token expires, the user will always get a fresh token.

### Authentication Context

The authentication uses `context` to pass the user information across the different component. See `components/context.tsx`. Refer to [React Context](https://reactjs.org/docs/context.html) documentation for more information.

### Authentication Components

The authentication feature has created multiple different component used in various places.

#### `AuthenticationGuard`

This component is used to check if the user is authenticated. If not, it redirects to the login page.

???+ example "Usage"
    This component is just a wrapper around your component.
    ```
    <AuthenticationGuard>
        <YourComponent />
    </AuthenticationGuard>
    ```

#### `PermissionGuard`

This component is an extention of `AuthenticationGuard` and is used to check if the user has the permission to access the page. TODO

## Backend

The backend authentication is handled by [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/) with a plugin called d[jangorestframework-simplejwt](https://github.com/jazzband/djangorestframework-simplejwt) (plugin reference [link](https://dj-rest-auth.readthedocs.io/en/latest/installation.html?highlight=jwt#json-web-token-jwt-support-optional)).

This is currently served at `api/v1/authentication` (see `backend/config/urls.py::api_patterns`)

## Google OAuth setup

Sign up for [Google Cloud](https://cloud.google.com) and create a new project from the [console](https://console.cloud.google.com).

On the side menu under "APIs and services" click "Credentials"

At the top of the page click "Create credentials" and select "OAuth client ID"

Now fill out the form with these values:

| Field                         | Value                                                            |
| ----------------------------- | ---------------------------------------------------------------- |
| Application Type              | Web Application                                                  |
| Authorized Javascript origins | `<YOURDOMAIN>:8000`                                              |
| Authorized redirect URIs      | `<YOURDOMAIN>:8000/api/v1/authentication/google/login/callback/` |

Replace `<YOURDOMAIN>` with your real domain, for example in testing it could be `http://localhost`

Now that you have created the OAuth client, copy the Client ID and Client secret from the side. Paste these into your `.env` file with keys `GOOGLE_CLIENT_ID` and `GOOGLE_SECRET`

While in development you will need to manually add users until Google approves your application. Click "OAuth consent screen" on the left. You can add up to 100 test users, which are the emails of Google accounts. 

## OAuth process

The user presses a button on the login page

The user is directed to the endpoint `/api/v1/authentication/google/login/redirect/`, which crafts a Google login page URL based on the application's Google client ID.

`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=DOMAIN/api/v1/authentication/google/login/callback/&prompt=consent&response_type=code&client_id={GOOGLE_CLIENT_ID}&scope={scope}{params}`

The user is redirected to the URL, then signs into their Google account on Google's login page.

Google redirects the user to the `callback_url` which is an backend API endpoint on our server: `/api/v1/authentication/google/login/callback/`.

Google `GET`s this callback endpoint with data including a code. The callback endpoint redirects the user to a login page on the frontend. The code is then `POST`ed to `/api/v1/authentication/google/`. The backend then logs the user into their account on our server.

## Links

- [Google OAuth docs](https://developers.google.com/identity/protocols/oauth2/web-server)