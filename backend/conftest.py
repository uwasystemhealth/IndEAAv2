import uuid
import pytest

from django.core.management import call_command
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings


@pytest.fixture
def test_password():
    return 'strong-test-pass'


@pytest.fixture
def create_user(db, django_user_model, test_password) -> dict:
    # https://djangostars.com/blog/django-pytest-testing/
    user_created = None

    def make_user(**kwargs):
        kwargs['password'] = test_password
        if 'username' not in kwargs:
            kwargs['username'] = str(uuid.uuid4())
        user_created = django_user_model.objects.create_user(**kwargs)
        return user_created
    yield make_user

    if user_created:
        user_created.delete()


@pytest.fixture
@pytest.mark.django_db
def setup_indeaa(create_user) -> dict:
    """ Create a basic fixture with the command configure_indeaa
        and returns a dict with orm object to be used in other fixtures
    """

    call_command('configure_indeaa')
    call_command('make_superuser', 'admin', 'Password123')


@pytest.fixture
def api_client():
    """
    This is the Django Rest Framework request client that can be used to perform
    HTTP request tests
    """
    client = APIClient()
    return client


@pytest.fixture
def api_client_no_auth():
    """
    Forces no authentication
    """
    client = APIClient()
    client.force_authenticate(user=None)
    return client


@pytest.fixture
def api_client_with_credentials(
    db, create_user, api_client
):
    user = create_user()
    api_client.force_authenticate(user=user)
    yield api_client
    api_client.force_authenticate(user=None)


@pytest.fixture
def api_client_with_credentials_return_user(
    db, create_user, api_client
):
    user = None

    def _api_client_with_credentials():
        user = create_user()
        api_client.force_authenticate(user=user)
        return api_client, user

    yield _api_client_with_credentials

    # Teardown
    api_client.force_authenticate(user=None)
    if user:
        user.delete()


@pytest.fixture
@pytest.mark.django_db
def get_auth():

    def _get_auth(username="admin", prepend_with_bearer=True):
        """ Create a headers with `Bearer XXXX`
        """
        # Create token from JWT library
        user = User.objects.get(username=username)
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return f'Bearer {token}' if prepend_with_bearer else token

    yield _get_auth
