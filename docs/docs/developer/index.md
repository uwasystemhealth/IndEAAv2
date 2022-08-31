# Developer Documentation

## Execution

Make sure you have docker installed.

To start the application.

1. Copy `docker/indeaa-local.env` to `.env` (in the root folder)
2. run `docker-compose up`

This command should setup the containers (it will take sometime if this is the first time you ran that command). Then you can start development.

???+ warning "Google Authentication?"
    You will need to create an OAuth 2.0 client in Google Cloud and provide the details in the `.env` file. See [Authentication](authentication.md#google-oauth-setup) for more details
