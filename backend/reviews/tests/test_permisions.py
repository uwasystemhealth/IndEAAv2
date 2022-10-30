from django.urls import reverse
from rest_framework import status


def test_coordinators_get_method(api_client_with_credentials_return_user, make_course_evaluation, make_course_review):
    """
    GIVEN: A course evaluation and a review is created
    WHEN:  A coordinator tries to query a GET method (LIST or DETAIL)
    THEN:  It succeeds
    """
    api_client, user = api_client_with_credentials_return_user()

    course_evaluation = make_course_evaluation(coordinators=[user])

    course_review = make_course_review(course_evaluation=course_evaluation)

    # Check the list view
    url = reverse("api-v1:reviews:reviews-list")
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    data = response.data["results"]
    # The coordinator cannot see the review on the list (because this is not their own review)
    assert len(data) == 0

    review_ids = [review["id"] for review in data]
    assert str(course_review.id) not in review_ids

    # Check the detail view
    url = reverse("api-v1:reviews:reviews-detail", kwargs={"pk": course_review.id})
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK


def test_other_users_get_method(api_client_with_credentials_return_user, make_course_evaluation, make_course_review):
    """
    GIVEN: A course evaluation and a review is created
    WHEN:  A user tries to query a GET method (LIST or DETAIL)
    THEN:  It fails
    """

    api_client, user = api_client_with_credentials_return_user()

    course_evaluation = make_course_evaluation()

    course_review = make_course_review(course_evaluation=course_evaluation)

    # Check the list view
    url = reverse("api-v1:reviews:reviews-list")
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    data = response.data["results"]
    assert len(data) == 0

    review_ids = [review["id"] for review in data]
    assert str(course_review.id) not in review_ids

    # Check the detail view
    url = reverse("api-v1:reviews:reviews-detail", kwargs={"pk": course_review.id})
    response = api_client.get(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN
