"""
This test file is focused on permission testing. This is to ensure that unauthorised access cannot use the API
"""
from django.urls import reverse
from rest_framework import status

from course_evaluations.models import CourseEvaluation


def test_list_view_course_evaluation_anonymous(api_client_no_auth):
    """
    GIVEN: The user is not authenticated
    WHEN: the user tries to use the endpoint
    THEN: The user is not authorised to use the endpoint
    """
    url = reverse("api-v1:course_evaluations:course-evaluations-list")
    response = api_client_no_auth.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_create_view_course_evaluation_anonymous(api_client_no_auth):
    """
    GIVEN: The user is not authenticated
    WHEN: I create a course evaluation
    THEN:  The user is not authorised to use the endpoint
    """
    url = reverse("api-v1:course_evaluations:course-evaluations-list")
    data = {
        "unit_code": "TEST",
        "description": "Test Course Evaluation",
    }
    response = api_client_no_auth.post(url, data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert CourseEvaluation.objects.count() == 0


def test_update_view_course_evaluation_anonymous(api_client_no_auth, create_user, make_course_evaluation):
    """
    GIVEN: The user is not authenticated
    WHEN: I update a course evaluation
    THEN: The user is not authorised to use the endpoint
    """
    user = create_user()
    course_evaluation = make_course_evaluation(coordinators=[user])

    url = reverse(
        "api-v1:course_evaluations:course-evaluation-detail",
        kwargs={"pk": course_evaluation.id},
    )
    data = {"unit_code": "TEST"}
    response = api_client_no_auth.put(url, data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert CourseEvaluation.objects.count() == 1


def test_delete_view_course_evaluation_anonymous(api_client_no_auth, create_user, make_course_evaluation):
    """
    GIVEN: The user is not authenticated
    WHEN: I delete a course evaluation
    THEN: The user is not authorised to use the endpoint
    """
    user = create_user()
    course_evaluation = make_course_evaluation(coordinators=[user])

    url = reverse(
        "api-v1:course_evaluations:course-evaluation-detail",
        kwargs={"pk": course_evaluation.id},
    )
    response = api_client_no_auth.delete(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert CourseEvaluation.objects.count() == 1
