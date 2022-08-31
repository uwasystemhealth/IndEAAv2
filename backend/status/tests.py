from django.conf import settings
from django.test import Client
from django.urls import reverse


def test_local_version_endpoint_is_accessible_to_anyone(client: Client) -> None:
    """
    GIVEN:  A user who try to check status IndEAA
    WHEN:   A user call /v1/status
    THEN:   User receives a status code equal to 200
    AND:    The user receives the app name
    """

    # Call without auth
    url = reverse("api-v1:status:status")
    response = client.get(url, HTTP_CLIENT_SOURCE="Tests")

    app_name = response.json()["data"]["Application name"]
    local_version = response.json()["data"]["Local version"]
    environment = response.json()["data"]["Environment"]
    settings_module = response.json()["data"]["Variables"]["DJANGO_SETTINGS_MODULE"]
    # user_sentry = response.json()["data"]["Variables"]["USE_SENTRY"]
    # sentry_env = response.json()["data"]["Variables"]["SENTRY_ENV"]
    gitshorthash = response.json()["data"]["Variables"]["GITSHORTHASH"]

    assert response.status_code == 200
    assert app_name == settings.APP_NAME
    assert local_version == settings.APP_VER
    assert environment == settings.APP_ENV
    assert settings_module == settings.DJANGO_SETTINGS_MODULE
    # assert user_sentry == settings.USE_SENTRY
    # # assert sentry_env == settings.SENTRY_ENV
    assert gitshorthash == settings.GITSHORTHASH
