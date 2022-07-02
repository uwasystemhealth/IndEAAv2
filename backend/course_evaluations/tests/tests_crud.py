"""
This test file is focused on the crud functionality of the course evaluations.

Note: Permission testing is not the focus of this test file.
"""
from django.conf import settings
from django.urls import reverse
from rest_framework import status


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
