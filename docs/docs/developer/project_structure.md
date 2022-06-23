# Project Structure

## `.github`
These contains the relevant files related to github:

- github action automation scripts (CI scripts)
- issue templates
- pull request templates

## `docker`
These files contains the recipes to build the docker containers for various parts of the web app.

This folder also contains the environment variables that are loaded by the containers.

## `backend`
These files contains anything related to the backend or the API. The main tech is [Django](https://www.djangoproject.com/) with [Django Rest Framework](https://www.django-rest-framework.org/).

The main files and folders (that you will need to know very well) are:
- `commands`: Contains custom [Django commands](https://docs.djangoproject.com/en/4.0/howto/custom-management-commands/)
- `config`: This contains the main Django configurations for the application
- `static`: This contains the static files that can be used for Django Templating engine (eg. Email and Frontend files served through Nginx as part of the backend interface)
- `templates`: This contains the templates to be used for Django Templating engine
- `utils`: These contains helper functions that are used in the application
- `pyproject.toml`: Contains the dependencies of the project
- `manage.py`: Main entrypoint for Django CLI commands
- `conftest.py`: Pytest setup special file

## `frontend`
These files contains anything related to the frontend. The main tech is [React](https://reactjs.org/) ([NextJS](https://nextjs.org/))

The main files and folders (that you will need to know very well) are:

- `cypress`: anything related to integration tests of Cypress will be here
- `cypress.config.ts`: the configuration file for Cypress
- `components`: React components
- `pages`: Page Components of NextJS
- `package.json`: Contains the dependencies of the project
- `utils`: These contains helper functions that are used in the application

## `docs`

This contains the files related to spinning up [Mkdocs](https://squidfunk.github.io/mkdocs-material/).