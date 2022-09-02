"""
This test file is focused on the crud functionality of the course evaluations.

Note: Permission testing is not the focus of this test file.
"""
from django.urls import reverse
from rest_framework import status

from course_evaluations.models import CourseEvaluationJustification, EOCSpecific


def test_list_view_course_evaluation_justification_as_coordinator(
    api_client_with_credentials_return_user,
    make_course_evaluation,
    make_course_evaluation_justification,
):
    """
    GIVEN: There are multiple course evaluation justifications
    WHEN: The endpoint for the course evaluation is called
    THEN: The course evaluation data is returned successfully with only a couple of information (eg. EOC info is not returned)
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation_1 = make_course_evaluation(coordinators=[user])
    make_course_evaluation_justification(course_evaluation=course_evaluation_1)
    url = reverse(
        "api-v1:course_evaluations:justifications-list",
        kwargs={"course_evaluation_id": course_evaluation_1.id},
    )
    response = api_client.get(url)

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


def test_create_view_course_evaluation_justification_as_coordinator(setup_indeaa, api_client_with_credentials_return_user, make_course_evaluation):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN:  I create a justification for the course evaluation
    THEN: The justification is created successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])

    url = reverse(
        "api-v1:course_evaluations:justifications-list",
        kwargs={"course_evaluation_id": course_evaluation.id},
    )

    # Just assign it to 2 different EOCs
    eoc_specifics_to_use = EOCSpecific.objects.all()[:2]
    data = {
        "development_level": 1,
        "justification": "New justification",
        "eoc_specifics": [eoc_specific.id for eoc_specific in eoc_specifics_to_use],
    }
    response = api_client.post(url, data)

    assert response.status_code == status.HTTP_201_CREATED

    # Check that the course evaluation is created
    justification = CourseEvaluationJustification.objects.first()
    assert justification.development_level == data["development_level"]
    assert justification.justification == data["justification"]
    assert justification.eoc_specifics.count() == len(data["eoc_specifics"])


def test_create_view_course_evaluation_justification_as_bad_parameters(
    setup_indeaa, api_client_with_credentials_return_user, make_course_evaluation, make_course_evaluation_justification
):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN:  I create a justification for the course evaluation with bad parameters
    THEN: The justification is not created successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    # Setup: Create an existing justification
    eoc_specifics_to_use = EOCSpecific.objects.all()[3:5]  # These are different EOC Specifics for setup
    make_course_evaluation_justification(
        course_evaluation=course_evaluation,
        eoc_specifics=eoc_specifics_to_use,
    )

    url = reverse(
        "api-v1:course_evaluations:justifications-list",
        kwargs={"course_evaluation_id": course_evaluation.id},
    )

    # Bad parameter: Existing justification
    eoc_specifics_to_use = EOCSpecific.objects.all()[2:4]
    data = {
        "development_level": 1,
        "justification": "New justification",
        "eoc_specifics": [eoc_specific.id for eoc_specific in eoc_specifics_to_use],
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert CourseEvaluationJustification.objects.count() == 1  # Check that the justification is not created (this is the initial creation)

    # Bad  parameter: No EOC Specifics
    data["eoc_specifics"] = []
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert CourseEvaluationJustification.objects.count() == 1  # Check that the justification is not created (this is the initial creation)


def test_update_view_course_evaluation_justification_as_coordinator(
    api_client_with_credentials_return_user,
    make_course_evaluation,
    make_course_evaluation_justification,
):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN: I update the course evaluation justification
    THEN: The course evaluation justification is updated successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    justification = make_course_evaluation_justification(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:justifications-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": justification.id},
    )
    data = {
        "justification": "New justification",
        "eoc_specifics": [eoc_specific.id for eoc_specific in justification.eoc_specifics.all()],
    }

    # Before doing the patch/update, just check
    assert justification.justification != data["justification"]

    response = api_client.patch(url, data)

    assert response.status_code == status.HTTP_200_OK


def test_update_view_course_evaluation_justification_as_coordinator_bad_parameter(
    api_client_with_credentials_return_user,
    make_course_evaluation,
    make_course_evaluation_justification,
):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN: I update the course evaluation justification with the same EOC Specifics as an existing one
    THEN: The course evaluation justification is not updated successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    justification_1 = make_course_evaluation_justification(course_evaluation=course_evaluation)
    justification_2 = make_course_evaluation_justification(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:justifications-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": justification_2.id},
    )
    data = {
        "justification": "New justification",
        "eoc_specifics": [eoc_specific.id for eoc_specific in justification_1.eoc_specifics.all()],
    }
    response = api_client.patch(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert justification_2.justification != data["justification"]


def test_update_view_course_evaluation_justification_as_coordinator_delete_scenario(
    api_client_with_credentials_return_user,
    make_course_evaluation,
    make_course_evaluation_justification,
):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN: I update the course evaluation justification with no EOC
    THEN: The course evaluation justification is deleted
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    justification = make_course_evaluation_justification(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:justifications-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": justification.id},
    )
    data = {
        "eoc_specifics": [],
    }
    response = api_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert CourseEvaluationJustification.objects.count() == 0
