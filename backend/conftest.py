import uuid

import pytest
from dj_rest_auth.utils import jwt_encode
from django.contrib.auth.models import User
from django.core.management import call_command
from rest_framework.test import APIClient

from course_evaluations.models import CourseEvaluation, EOCSet


@pytest.fixture
def test_password():
    return "strong-test-pass"


@pytest.fixture
def create_user(db, django_user_model, test_password) -> dict:
    # https://djangostars.com/blog/django-pytest-testing/
    user_created = None

    def make_user(**kwargs):
        kwargs["password"] = test_password
        if "username" not in kwargs:
            kwargs["username"] = str(uuid.uuid4())
        user_created = django_user_model.objects.create_user(**kwargs)
        return user_created

    yield make_user

    if user_created:
        user_created.delete()


@pytest.fixture
@pytest.mark.django_db
def setup_indeaa(create_user) -> dict:
    """Create a basic fixture with the command configure_indeaa
    and returns a dict with orm object to be used in other fixtures
    """

    call_command("configure_indeaa")
    call_command("make_superuser", "admin", "admin@admin.com", "Password123")


@pytest.fixture
def api_client():
    """
    This is the Django Rest Framework request client that can be used to perform
    HTTP request tests
    """
    client = APIClient()
    return client


@pytest.mark.django_db
@pytest.fixture
def api_client_no_auth():
    """
    Forces no authentication
    """
    client = APIClient()
    client.force_authenticate(user=None)
    return client


@pytest.fixture
def api_client_with_credentials(db, create_user, api_client):
    user = create_user()
    api_client.force_authenticate(user=user)
    yield api_client
    api_client.force_authenticate(user=None)


@pytest.fixture
def api_client_with_credentials_return_user(db, create_user, api_client):
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
    def _get_auth(username="admin"):
        """Create a headers with `Bearer XXXX`"""
        # Create token from JWT library
        user = User.objects.get(username=username)
        access_token, refresh_token = jwt_encode(user)
        return access_token, refresh_token

    yield _get_auth


@pytest.fixture
@pytest.mark.django_db
def make_course_evaluation(setup_indeaa) -> CourseEvaluation:
    """Make CourseEvaluation on demand inside tests"""
    created_course_evaluation = []

    # Create a CourseEvaluation record
    def _make_course_evaluation(
        unit_code="TEST1001",
        description="Test CourseEvaluation",
        coordinators=[],
        eoc_set=None,
    ):
        # Get the default EOC set
        if eoc_set is None:
            # This is setup using `configure_indeaa` django command
            eoc_set = EOCSet.objects.first()

        # Create the record
        course_evaluation = CourseEvaluation.objects.create(
            unit_code=unit_code,
            description=description,
            eoc_set=eoc_set,
        )

        for coordinator in coordinators:
            course_evaluation.coordinators.add(coordinator)

        course_evaluation.save()

        created_course_evaluation.append(course_evaluation)

        return course_evaluation

    # Recommended reading: https://docs.pytest.org/en/stable/fixture.html#yield-fixtures-recommended
    yield _make_course_evaluation

    # Teardown
    for course_evaluation in created_course_evaluation:
        course_evaluation.delete()
