"""
This test file is focused on the crud functionality of the course evaluations.

Note: Permission testing is not the focus of this test file.
"""
from django.conf import settings
from django.urls import reverse
from rest_framework import status

from course_evaluations.models import CourseEvaluation, EOCSet


def test_list_view_course_evaluation(api_client_with_credentials_return_user, make_course_evaluation):
    """
    GIVEN: There are multiple course evaluation assigned to a user
    WHEN: The endpoint for the course evaluation is called
    THEN: The course evaluation data is returned successfully with only a couple of information (eg. EOC info is not returned)
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation_1 = make_course_evaluation(coordinators=[user])
    course_evaluation_2 = make_course_evaluation(coordinators=[user])

    # This user should not be able to see this
    course_evaluation_3 = make_course_evaluation(coordinators=[])

    url = reverse("api-v1:course_evaluations:course-evaluations-list")
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    data = response.data

    # Check that we can find the two course evaluations
    assert len(data) == 2
    assert data[0]["id"] == str(course_evaluation_1.id)
    assert data[1]["id"] == str(course_evaluation_2.id)

    # Check the content of one of the course_evaluation
    course_evaluation_from_endpoint = data[0]
    assert course_evaluation_from_endpoint["id"] == str(course_evaluation_1.id)
    assert course_evaluation_from_endpoint["unit_code"] == course_evaluation_1.unit_code
    assert course_evaluation_from_endpoint["description"] == course_evaluation_1.description

    # Check the coordinator
    assert len(course_evaluation_from_endpoint["coordinators"]) == 1
    coordinator = course_evaluation_from_endpoint["coordinators"][0]

    assert coordinator["id"] == user.id
    assert coordinator["username"] == user.username

    # Check that there are certain fields that does not exist
    assert "eoc_set" not in course_evaluation_from_endpoint
    assert "eoc_set_id" not in course_evaluation_from_endpoint


def test_create_view_course_evaluation(setup_indeaa, api_client_with_credentials_return_user):
    """
    GIVEN: As a user of the system
    WHEN: I create a course evaluation
    THEN: The course evaluation is created successfully
    """
    api_client, user = api_client_with_credentials_return_user()

    url = reverse("api-v1:course_evaluations:course-evaluations-list")
    data = {
        "eoc_set_id": str(EOCSet.objects.first().id),
        "unit_code": "TEST1002",
        "description": "Test Creation of CourseEvaluation",
    }
    response = api_client.post(url, data)

    assert response.status_code == status.HTTP_201_CREATED

    # Check that the course evaluation is created
    course_evaluation = CourseEvaluation.objects.first()
    assert course_evaluation.unit_code == data["unit_code"]
    assert course_evaluation.description == data["description"]
    assert course_evaluation.eoc_set == EOCSet.objects.first()


def test_update_view_course_evaluation(api_client_with_credentials_return_user, make_course_evaluation):
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