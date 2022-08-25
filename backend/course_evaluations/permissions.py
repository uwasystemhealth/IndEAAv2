from rest_framework import permissions


class CourseEvaluationIsCoordinatorAllowAllReviewerReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow coordinators the API
    """

    def has_object_permission(self, request, view, obj):
        """
        A coordinator should be allowed to perform any operation

        Note: This only applies for methods that calls `.get_object()`
        see https://stackoverflow.com/questions/69959797/has-object-permission-not-working-for-detail-action-decorator
        """
        reviewers = [review.reviewer for review in obj.reviews.all()]
        if request.method in permissions.SAFE_METHODS and request.user.id in reviewers:
            return True
        return request.user in obj.coordinators.all()


class CourseEvaluationIsCoordinatorAllowAllViaObjectReference(permissions.BasePermission):
    """
    Custom permission to only allow coordinators the API based on the query parameters in the URL
    """

    def has_permission(self, request, view):
        course_evaluation_id = view.kwargs["course_evaluation_id"]

        # Check whether the user has a course_evaluation that is desired
        course_evaluations = request.user.course_evaluation_coordinator.all()
        if course_evaluations.filter(id=course_evaluation_id).exists():
            return True
