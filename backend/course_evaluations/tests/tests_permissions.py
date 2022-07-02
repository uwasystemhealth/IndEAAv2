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


def test_update_view_course_evaluation_anonymous(api_client_with_credentials_return_user, make_course_evaluation):
    """
    GIVEN: A course evaluation is created
    WHEN: I update the course evaluation
    THEN: The course evaluation is updated successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation_1 = make_course_evaluation(coordinators=[user])

    url = reverse("api-v1:course_evaluations:course-evaluations-detail", kwargs={"pk": course_evaluation_1.id})
    data = {
        "description": "Test Update of CourseEvaluation",
    }
    response = api_client.patch(url, data)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["unit_code"] == course_evaluation_1.unit_code
    assert response.data["description"] == data["description"]


def test_delete_view_course_evaluation(api_client_with_credentials_return_user, make_course_evaluation):
    """
    GIVEN: A course evaluation is created
    WHEN: I delete the course evaluation
    THEN: The course evaluation cannot be deleted
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation_1 = make_course_evaluation(coordinators=[user])

    url = reverse("api-v1:course_evaluations:course-evaluations-detail", kwargs={"pk": course_evaluation_1.id})
    response = api_client.delete(url)

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    assert CourseEvaluation.objects.count() == 1
