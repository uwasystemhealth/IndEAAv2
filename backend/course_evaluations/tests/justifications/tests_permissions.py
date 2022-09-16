"""
This test file is focused on permission testing. This is to ensure that unauthorised access cannot use the API
"""
import pytest
from django.urls import reverse
from rest_framework import status

from course_evaluations.models import CourseEvaluation, CourseEvaluationJustification


@pytest.mark.django_db
def test_list_view_course_evaluation_justifications_anonymous(api_client_no_auth, make_course_evaluation):
    """
    GIVEN: The user is not authenticated
    WHEN: the user tries to use the endpoint
    THEN: The user is not authorised to use the endpoint
    """
    course_evaluation = make_course_evaluation(coordinators=[])
    url = reverse(
        "api-v1:course_evaluations:justifications-list",
        kwargs={"course_evaluation_id": course_evaluation.id},
    )
    response = api_client_no_auth.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_create_view_course_evaluation_justifications_anonymous(api_client_no_auth, make_course_evaluation):
    """
    GIVEN: The user is not authenticated
    WHEN: I create a course evaluation justification
    THEN:  The user is not authorised to use the endpoint
    """
    course_evaluation = make_course_evaluation(coordinators=[])
    url = reverse(
        "api-v1:course_evaluations:justifications-list",
        kwargs={"course_evaluation_id": course_evaluation.id},
    )
    data = {
        #    Data does not matter as the user is not authenticated (the return error is 400 if data is invalid)
    }
    response = api_client_no_auth.post(url, data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert CourseEvaluation.objects.count() == 1
    assert CourseEvaluationJustification.objects.count() == 0


@pytest.mark.django_db
def test_update_view_course_evaluation_justifications_anonymous(api_client_no_auth, make_course_evaluation_justification, make_course_evaluation):
    """
    GIVEN: The user is not authenticated
    WHEN: I update a course evaluation justification
    THEN: The user is not authorised to use the endpoint
    """
    course_evaluation = make_course_evaluation()
    justification = make_course_evaluation_justification(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:justifications-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": justification.id},
    )
    data = {"name": "new name"}
    response = api_client_no_auth.put(url, data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert CourseEvaluation.objects.count() == 1


@pytest.mark.django_db
def test_delete_view_course_evaluation_justifications_anonymous(api_client_no_auth, make_course_evaluation_justification, make_course_evaluation):
    """
    GIVEN: The user is not authenticated
    WHEN: I delete a course evaluation justification
    THEN: The user is not authorised to use the endpoint
    """
    course_evaluation = make_course_evaluation()

    justification = make_course_evaluation_justification(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:justifications-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": justification.id},
    )
    response = api_client_no_auth.delete(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert CourseEvaluation.objects.count() == 1


@pytest.mark.django_db
def test_create_view_course_evaluation_justifications_reviewer(api_client_with_credentials_return_user, make_course_evaluation, make_course_review):
    """
    GIVEN: The user is authenticated and is a reviewer
    WHEN: I create a course evaluation justification
    THEN:  The user is not authorised to use the endpoint
    """
    course_evaluation = make_course_evaluation(coordinators=[])
    api_client, user = api_client_with_credentials_return_user()
    make_course_review(course_evaluation=course_evaluation, reviewer=user)
    url = reverse(
        "api-v1:course_evaluations:justifications-list",
        kwargs={"course_evaluation_id": course_evaluation.id},
    )
    data = {
        #    Data does not matter as The user is authenticated and is a reviewer (the return error is 400 if data is invalid)
    }
    response = api_client.post(url, data)

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert CourseEvaluation.objects.count() == 1
    assert CourseEvaluationJustification.objects.count() == 0


@pytest.mark.django_db
def test_update_view_course_evaluation_justifications_reviewer(
    api_client_with_credentials_return_user,
    make_course_evaluation_justification,
    make_course_evaluation,
    make_course_review,
):
    """
    GIVEN: The user is authenticated and is a reviewer
    WHEN: I update a course evaluation justification
    THEN: The user is not authorised to use the endpoint
    """
    course_evaluation = make_course_evaluation()
    api_client, user = api_client_with_credentials_return_user()
    make_course_review(course_evaluation=course_evaluation, reviewer=user)

    justification = make_course_evaluation_justification(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:justifications-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": justification.id},
    )
    data = {"name": "new name"}
    response = api_client.put(url, data)

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert CourseEvaluation.objects.count() == 1


@pytest.mark.django_db
def test_delete_view_course_evaluation_justifications_reviewer(
    api_client_with_credentials_return_user,
    make_course_evaluation_justification,
    make_course_evaluation,
    make_course_review,
):
    """
    GIVEN: The user is authenticated and is a reviewer
    WHEN: I delete a course evaluation justification
    THEN: The user is not authorised to use the endpoint
    """
    course_evaluation = make_course_evaluation()
    api_client, user = api_client_with_credentials_return_user()
    make_course_review(course_evaluation=course_evaluation, reviewer=user)

    justification = make_course_evaluation_justification(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:justifications-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": justification.id},
    )
    response = api_client.delete(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert CourseEvaluation.objects.count() == 1
