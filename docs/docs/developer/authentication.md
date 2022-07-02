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