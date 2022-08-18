from rest_framework import permissions

from course_evaluations.models import CourseEvaluation
from course_evaluations.permissions import CourseEvaluationIsCoordinatorAllowAll


class DocumentCoordinatorAllowAllReviewerReadOnly(CourseEvaluationIsCoordinatorAllowAll):
    """
    Custom permission to Coordinators for all permissions, and read only for Reviewer
    """

    def has_permission(self, request, view):

        # Check whether the user has a review for the course_evaluation
        reviews = request.user.reviews.all()
        course_evaluation_id = view.kwargs["course_evaluation_id"]
        if reviews.filter(course_evaluation_id=course_evaluation_id).exists():
            return True

        return super().has_permission(request, view)
