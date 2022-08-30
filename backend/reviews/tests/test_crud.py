"""
This test file is focused on the crud functionality of the review

Note: Permission testing is not the focus of this test file.
"""
import email
from datetime import datetime

from allauth.account.models import EmailAddress
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

from reviews.models import Review


def test_list_view_course_review(api_client_with_credentials_return_user, make_course_evaluation, make_course_review):
    """
    GIVEN: There are multiple review
    WHEN: The endpoint for the review is called
    THEN: The review data is returned successfully
    """
    api_client, user = api_client_with_credentials_return_user()

    course_evaluation_at_which_user_is_a_coordinator = make_course_evaluation(coordinators=[user])

    # This is a review for another user, but the user is a coordinator of the course evaluation
    course_review_1 = make_course_review(course_evaluation=course_evaluation_at_which_user_is_a_coordinator)

    # This is the review for another course evaluation
    course_review_2 = make_course_review(reviewer=user)
    # Another course_evaluation
    course_review_3 = make_course_review(reviewer=user)

    url = reverse("api-v1:reviews:reviews-list")
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    data = response.data["results"]
    assert len(data) == 2

    review_ids = [review["id"] for review in data]
    assert str(course_review_1.id) not in review_ids
    assert str(course_review_2.id) in review_ids
    assert str(course_review_3.id) in review_ids


def test_create_view_course_review(setup_indeaa, api_client_with_credentials_return_user, make_course_evaluation):
    """
    GIVEN: As a user of the system
    WHEN: I create a course review
    THEN: The course review is created successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])

    url = reverse("api-v1:reviews:reviews-list")
    data = {
        "email": "new_user@gmail.com",
        "course_evaluation": course_evaluation.id,
    }
    response = api_client.post(url, data)

    assert response.status_code == status.HTTP_201_CREATED

    # Check that the course review is created
    assert Review.objects.count() == 1
    review = Review.objects.first()
    assert review.course_evaluation == course_evaluation
    assert review.reviewer.email == data["email"]

    # We can find the user in the database
    assert User.objects.filter(email=data["email"]).count() == 1
    assert EmailAddress.objects.filter(email=data["email"]).count() == 1


def test_update_view_course_review(api_client_with_credentials_return_user, make_course_evaluation, make_course_review):
    """
    GIVEN: A course review is created with the user as the coordinator
    WHEN: The coordinator black the course review
    THEN: The course review is updated successfully
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    course_review_1 = make_course_review(course_evaluation=course_evaluation, date_submitted=datetime.today())

    url = reverse("api-v1:reviews:reviews-detail", kwargs={"pk": course_review_1.id})
    data = {"date_submitted": ""}

    # Check the date_submitted first
    assert course_review_1.date_submitted is not None

    response = api_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK

    course_review_1.refresh_from_db()
    assert response.data["date_submitted"] == course_review_1.date_submitted


def test_delete_view_course_review(api_client_with_credentials_return_user, make_course_evaluation, make_course_review):
    """
    GIVEN: A course review is created
    WHEN: The coordinator deletes the course review
    THEN: The course review can be deleted
    """
    api_client, user = api_client_with_credentials_return_user()
    course_evaluation = make_course_evaluation(coordinators=[user])
    course_review_1 = make_course_review(course_evaluation=course_evaluation)

    url = reverse("api-v1:reviews:reviews-detail", kwargs={"pk": course_review_1.id})
    response = api_client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Review.objects.count() == 0
