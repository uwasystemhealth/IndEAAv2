"""
This test file is focused on the crud functionality of the course evaluations.

Note: Permission testing is not the focus of this test file.
"""
from django.urls import reverse
from rest_framework import status

from documents.models import Document


def test_list_view_course_evaluation_document_as_coordinator(
    api_client_with_credentials_return_user,
    make_course_evaluation,
    make_course_evaluation_document,
):
    """
    GIVEN: There are multiple course evaluation documents
    WHEN: The endpoint for the course evaluation is called
    THEN: The course evaluation data is returned successfully with only a couple of information (eg. EOC info is not returned)
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation_1 = make_course_evaluation(coordinators=[user])
    course_evaluation_2 = make_course_evaluation(coordinators=[user])
    document_1 = make_course_evaluation_document(course_evaluation=course_evaluation_1)
    document_2 = make_course_evaluation_document(course_evaluation=course_evaluation_1)

    # This user should not be able to see this
    make_course_evaluation_document(course_evaluation=course_evaluation_2)

    url = reverse(
        "api-v1:course_evaluations:documents-list",
        kwargs={"course_evaluation_id": course_evaluation_1.id},
    )
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    data = response.data["results"]

    # Check that we can find the two course evaluations
    assert len(data) == 2
    assert data[0]["id"] == str(document_1.id)
    assert data[1]["id"] == str(document_2.id)


def test_create_view_course_evaluation_document_as_coordinator(setup_indeaa, api_client_with_credentials_return_user, make_course_evaluation):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN:  I create a document for the course evaluation
    THEN: The document is created successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])

    url = reverse(
        "api-v1:course_evaluations:documents-list",
        kwargs={"course_evaluation_id": course_evaluation.id},
    )
    data = {
        "eoc_generals": [],
        "eoc_specifics": [],
        "name": "Test Document",
        "description": "test description",
        "url": "https://google.com",
        "is_introduction": False,
    }
    response = api_client.post(url, data)

    assert response.status_code == status.HTTP_201_CREATED

    # Check that the course evaluation is created
    document = Document.objects.first()
    assert document.name == data["name"]
    assert document.description == data["description"]
    assert document.url == data["url"]
    assert document.is_introduction == data["is_introduction"]
    assert document.course_evaluation == course_evaluation
    assert document.eoc_generals.count() == 0
    assert document.eoc_specifics.count() == 0


def test_update_view_course_evaluation_document_as_coordinator(
    api_client_with_credentials_return_user,
    make_course_evaluation,
    make_course_evaluation_document,
):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN: I update the course evaluation document
    THEN: The course evaluation document is updated successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    document = make_course_evaluation_document(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:documents-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": document.id},
    )
    data = {
        "description": "New description",
    }

    # Before doing the patch/update, just check
    assert document.description != data["description"]

    response = api_client.patch(url, data)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["description"] == data["description"]
    # Refresh from db
    document.refresh_from_db()
    assert document.description == data["description"]


def test_delete_view_course_evaluation_document_as_coordinator(
    api_client_with_credentials_return_user,
    make_course_evaluation,
    make_course_evaluation_document,
):
    """
    GIVEN: As a coordinator of a course evaluation
    WHEN: I delete the course evaluation document
    THEN: The course evaluation document is deleted successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    document = make_course_evaluation_document(course_evaluation=course_evaluation)

    url = reverse(
        "api-v1:course_evaluations:documents-detail",
        kwargs={"course_evaluation_id": course_evaluation.id, "pk": document.id},
    )
    response = api_client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Document.objects.count() == 0
