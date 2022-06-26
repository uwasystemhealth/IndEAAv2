# Authentication

## Backend
The backend authentication is handled by [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/) with a plugin called d[jangorestframework-simplejwt](https://github.com/jazzband/djangorestframework-simplejwt) (plugin reference [link](https://dj-rest-auth.readthedocs.io/en/latest/installation.html?highlight=jwt#json-web-token-jwt-support-optional)).

This is currently served at `api/v1/authentication` (see `backend/config/urls.py::api_patterns`)