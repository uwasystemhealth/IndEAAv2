from django.urls import reverse
from django.contrib.auth.models import User

from rest_framework import status


def test_login_get_jwt_and_user_info_success(setup_indeaa, api_client):
    """
    GIVEN: A user is logged with the correct admin user details
    WHEN: A POST request is made to the /api/v1/authentication/login/ endpoint
    THEN: The response should contain a JWT and user info
    AND: The response should not have a 'password'
    """
    # Credentials for admin can be seen in `conftest.py`
    request = api_client.post(reverse("api-v1:rest_login"), {"username": "admin", "password": "Password123"})

    # Check that the response is OK (JWT Created)
    assert request.status_code == status.HTTP_200_OK
    assert "access_token" in request.data
    assert "refresh_token" in request.data
    assert "user" in request.data

    user = request.data["user"]
    assert user["username"] == "admin"


def test_reauthenticate_and_get_user_info_success(setup_indeaa, api_client, get_auth):
    """
    GIVEN: A user already has a JWT
    WHEN: A POST request is made to the /api/v1/authentication/token/refresh/ endpoint
    THEN: The response should contain a new JWT and newer expiration for the token
    """
    access_token, refresh_token = get_auth("admin")
    request = api_client.post(reverse("api-v1:token_refresh"), {"refresh": str(refresh_token)})

    # Check that the response is OK (JWT Created or already exist)
    assert request.status_code == status.HTTP_200_OK
    assert "access" in request.data

    new_access_token = request.data["access"]
    assert new_access_token != access_token

    expiry_datetime = request.data["access_token_expiration"]
    expiry_epoch = expiry_datetime.timestamp()
    assert expiry_epoch > access_token["exp"]


def test_verify_token_success(setup_indeaa, api_client, get_auth):
    """
    GIVEN: A user is logged with the correct admin user details
    WHEN: A POST request is made to the /api/v1/verify-token endpoint
    THEN: the user details should be seen there
    AND:  the token should not be removed
    """
    access_token, _ = get_auth("admin")

    request = api_client.post(reverse("api-v1:token_verify"), {"token": str(access_token)})

    # Check that the response is OK and JWT is still the same
    assert request.status_code == status.HTTP_200_OK


def test_get_user(setup_indeaa, api_client_with_credentials_return_user):
    """
    GIVEN: A user is logged in with a JWT (attached the JWT to the api client)
    WHEN:  A GET request is made to /api/v1/authentication/user/ endpoint
    THEN:  The user information should be returned successfully
    """

    api_client, user = api_client_with_credentials_return_user()

    request = api_client.get(reverse("api-v1:rest_user_details"))

    # Check that the response is OK and JWT is still the same
    assert request.status_code == status.HTTP_200_OK
    assert request.data["username"] == user.username


def test_login_get_jwt_and_user_info_failure(setup_indeaa, api_client):
    """
    GIVEN: A user is logged with the wrong admin user details
    WHEN: A POST request is made to the /api/v1/authentication/login/ endpoint
    THEN: The status code should be 400 (Wrong Credentials)
    """
    # Credentials for admin can be seen in `conftest.py`
    request = api_client.post(reverse("api-v1:rest_login"), {"username": "admin", "password": "WRONG_PASSWORD"})

    # Check that the response is OK (JWT Created)
    assert request.status_code == 400
    assert "non_field_errors" in request.data
    assert request.data["non_field_errors"][0] == "Unable to log in with provided credentials."


def test_reauthenticate_and_get_user_info_failure(setup_indeaa, api_client, get_auth):
    """
    GIVEN: A user is logged in with a JWT that has expired
    WHEN: A POST request is made to the /api/v1/authentication/token/refresh/ endpoint
    THEN: The status code should be 400 (JWT Expired)
    """

    # Hardcoded token that expired on Dec 9, 2021
    # This is for `admin` user
    EXPIRED_TOKEN = (
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
        ".eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjM5MDE5OTIxLCJleHAiOjE2MzkwMTk5MjIsImp0aSI6Ijk0Z"
        "DRkYTRhLTFiYTQtNGM0NS05NjE0LTNlMjdjMTY4MTBlOSIsInVzZXJfaWQiOjIwLCJvcmlnX2lhdCI6MTYzOTAxOTkyMX0"
        ".H3tEYYU8bESQ1yyR14GcVcSbM1u6GT1DmxqIszwaeB8"
    )

    request = api_client.post(reverse("api-v1:token_refresh"), {"refresh": EXPIRED_TOKEN})

    # Check that the response is OK (JWT Created or already exist)
    assert request.status_code == 401
    assert request.data["detail"] == "Token is invalid or expired"


def test_verify_token_failure(setup_indeaa, api_client, get_auth):
    """
    GIVEN: A user is logged in with a JWT that has expired
    WHEN: A POST request is made to the  /api/v1/authentication/token/verify/ endpoint
    THEN: The status code should be 400 (JWT Expired)
    """

    # Hardcoded token that expired on Dec 9, 2021
    # This is for `admin` user
    EXPIRED_TOKEN = (
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
        ".eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjM5MDE5OTIxLCJleHAiOjE2MzkwMTk5MjIsImp0aSI6Ijk0Z"
        "DRkYTRhLTFiYTQtNGM0NS05NjE0LTNlMjdjMTY4MTBlOSIsInVzZXJfaWQiOjIwLCJvcmlnX2lhdCI6MTYzOTAxOTkyMX0"
        ".H3tEYYU8bESQ1yyR14GcVcSbM1u6GT1DmxqIszwaeB8"
    )

    request = api_client.post(reverse("api-v1:token_verify"), {"token": EXPIRED_TOKEN})

    # Check that the response is OK (JWT Created or already exist)
    assert request.status_code == 401
    assert request.data["detail"] == "Token is invalid or expired"
