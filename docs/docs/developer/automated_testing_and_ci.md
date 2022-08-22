# Automated Testing and CI
Automated testing help us to ensure that our code is working as expected. Continuous Integration (CI) is a process that helps us to ensure that our code is working as expected by running our automated testing on events such as pull requests and code commits.

## Automated Testing

### Backend: Pytest (Unit Testing)
We use [pytest](https://docs.pytest.org/en/7.1.x/) for our tests with [pytest-django](https://pytest-django.readthedocs.io/en/latest/) as a plugin.
#### Running Test
1. Go inside the container `docker exec -it indeaa_django bash` or `docker-compose exec -it backend bash`
2. Run pytest `py.test` or `pytest`.


???+ info "Manual Testing Debugging"
    You can add `breakpoint()` in your code and attach a terminal to the instance `docker attach indeaa_django`.

???+ info "Running only a specific test"
    If you only want to run a specific test, use the below syntax
    ```
    py.test course_evaluations/ # Runs all test within the folder
    py.test course_evaluations/test_crud.py # Runs the test in the file
    py.test course_evaluations/test_crud.py::test_list_view_course_evaluation # Run the specific function you want
    ```

#### Pytest Fixture `conftest.py`
You will notice that the test will use `conftest.py`. The syntax is a little weird at first, the fixture becomes parameters in tests that needs it.

???+ example "Test that uses a conftest"

    ```python
    def test_list_view_course_evaluation(api_client_with_credentials_return_user, make_course_evaluation):
        api_client, user = api_client_with_credentials_return_user()
        course_evaluation_1 = make_course_evaluation(coordinators=[user])
        course_evaluation_2 = make_course_evaluation(coordinators=[user])
        ...
    ```

    `api_client_with_credentials_return_user` and `make_course_evaluation` are function that can bhe seen in `conftest.py`. This is accessible because of the command called `@pytest.fixture`. 
    
    Also notice function such as `make_course_evaluation`. It has an interesting structure where it does a `yield _make_course_evaluation`. We are essentially creating a wrapper function that allows us to bind the teardown with that function.

#### Why not just use the default Django Tests?
The [pytest ecosystem](https://docs.pytest.org/en/7.0.x/reference/plugin_list.html) is bigger. Harder to get used to at first, but it is quite worth it because you can do cool examples like [parametrised tests](https://docs.pytest.org/en/6.2.x/parametrize.html#pytest-mark-parametrize-parametrizing-test-functions) (checkout this link) that are more readable and maintainable.

### Frontend: Cypress (E2E Testing)
TODO Issue [#50](https://github.com/uwasystemhealth/IndEAAv2/issues/50)


## Continuous Integration - Github Actions

We use [github actions](https://github.com/features/actions) for our continuous integration. All the code being used for github actions can be seen in `.github/workflows/ci.yml`. This is the Continuous integration that runs for every commit on a pull request.

We run a couple of things as part of our CI:

- Automated Testing eg `pytest_py3`, `integration-test-docker`
- Automated Linting and Formatting eg `frontend-check` and `backend-check`