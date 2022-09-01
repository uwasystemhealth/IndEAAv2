"""
This test file is focused on the crud functionality of the course evaluations.

Note: Permission testing is not the focus of this test file.
"""
from django.urls import reverse
from rest_framework import status

from course_evaluations.models import CourseEvaluationJustification, EOCSpecific
from reviews.models import ReviewDocument


def test_list_view_review_document_as_reviewer(
    api_client_with_credentials_return_user,
    make_course_review,
    make_review_document,
):
    """
    GIVEN: There are review documents
    WHEN: The endpoint for review document is GET
    THEN: The method is not allowed (as the main review endpoint should be used)
    """
    api_client, user = api_client_with_credentials_return_user()
    review = make_course_review(reviewer=user)
    make_review_document(review=review)
    url = reverse(
        "api-v1:reviews:documents-list",
        kwargs={"review_id": review.id},
    )
    response = api_client.get(url)

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


def test_create_view_review_document_as_reviewer(
    setup_indeaa, api_client_with_credentials_return_user, make_course_review, make_course_evaluation_document
):
    """
    GIVEN: As a reviewer of a course evaluation
    WHEN:  I create a comment or view for the document
    THEN: The review for the document is created successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    review = make_course_review(reviewer=user)
    document = make_course_evaluation_document(course_evaluation=review.course_evaluation)

    url = reverse(
        "api-v1:reviews:documents-list",
        kwargs={"review_id": review.id},
    )

    data = {"comment": "New comment", "document": document.id}
    response = api_client.post(url, data)

    assert response.status_code == status.HTTP_201_CREATED

    # Check that the course evaluation is created
    reviewDocument = ReviewDocument.objects.first()
    assert reviewDocument.comment == data["comment"]

    # Try again, but this time only the `is_viewed`
    data = {"is_viewed": True, "document": document.id}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED


def test_create_view_review_document_as_bad_parameters(
    setup_indeaa,
    api_client_with_credentials_return_user,
    make_course_review,
):
    """
    GIVEN: As a reviewer of a course evaluation
    WHEN:  I create a comment or view for the document without a document_id
    THEN: The API should return it as bad parameter
    """
    api_client, user = api_client_with_credentials_return_user()
    review = make_course_review(reviewer=user)

    url = reverse(
        "api-v1:reviews:documents-list",
        kwargs={"review_id": review.id},
    )

    data = {
        "comment": "New comment",
    }
    response = api_client.post(url, data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # Try again, but this time only the `is_viewed`
    data = {"is_viewed": True}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_update_view_review_document_as_reviewer(
    api_client_with_credentials_return_user,
    make_course_review,
    make_review_document,
):
    """
    GIVEN: As a reviewer of a course evaluation
    WHEN: I update my comment or unmark viewing
    THEN: The review document is updated successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    review = make_course_review(reviewer=user)
    reviewDocument = make_review_document(review=review, is_viewed=True, comment="Old comment")

    url = reverse(
        "api-v1:reviews:documents-detail",
        kwargs={"review_id": review.id, "pk": reviewDocument.id},
    )

    data_1 = {
        "comment": "New comment",
    }
    response = api_client.patch(url, data_1)

    assert response.status_code == status.HTTP_200_OK

    # Check that the review document is updated
    reviewDocument.refresh_from_db()
    assert reviewDocument.comment == data_1["comment"]
    assert reviewDocument.is_viewed is True

    # Try again, but this time only the `is_viewed`
    data_2 = {"is_viewed": False}
    response = api_client.patch(url, data_2)
    assert response.status_code == status.HTTP_200_OK

    # Check that the review document is updated
    reviewDocument.refresh_from_db()
    assert reviewDocument.comment == data_1["comment"]
    assert reviewDocument.is_viewed is False
