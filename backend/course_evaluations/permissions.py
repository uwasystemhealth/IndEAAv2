from rest_framework import permissions


class CourseEvaluationIsCoordinatorAllowAll(permissions.BasePermission):
    """
    Custom permission to only allow coordinators the API
    """

    def has_object_permission(self, request, view, obj):
        """
        A coordinator should be allowed to perform any operation

        Note: This only applies for methods that calls `.get_object()`
        see https://stackoverflow.com/questions/69959797/has-object-permission-not-working-for-detail-action-decorator
        """
        return request.user in obj.coordinators.all()


class CourseEvaluationIsCoordinatorAllowAllViaObjectReference(CourseEvaluationIsCoordinatorAllowAll):
    """
    Custom permission to only allow coordinators the API (via Object Reference)
    Similar to CourseEvaluationIsCoordinatorAllowAll
    """

    def has_object_permission(self, request, view, obj):
        # See that the difference is that we are going to be using the course_evaluation_id in the url
        return request.user in obj.course_evaluation.coordinators.all()
