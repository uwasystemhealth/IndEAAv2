from rest_framework import permissions

from course_evaluations.models import CourseEvaluation


class DocumentCoordinatorAllowAllReviewerReadOnly(permissions.BasePermission):
    """
    Custom permission to Coordinators for all permissions, and read only for Reviewer
    """

    def has_permission(self, request, view):
        course_evaluation_id = view.kwargs["course_evaluation_id"]

        # Check whether the user has a course_evaluation that is desired
        course_evaluations = request.user.course_evaluation_coordinator.all()
        if course_evaluations.filter(id=course_evaluation_id).exists():
            return True

        # Check whether the user has a review for the course_evaluation
        if request.method in permissions.SAFE_METHODS:
            reviews = request.user.reviews.all()
            if reviews.filter(course_evaluation_id=course_evaluation_id).exists():
                return True

        return False
