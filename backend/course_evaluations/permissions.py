from rest_framework import permissions


class CourseEvaluationIsCoordinatorAllowAll(permissions.BasePermission):
    """
    Custom permission to only allow coordinators the API
    """

    def has_permission(self, request, view):
        """
        This permission applies on request level
        """
        # Check if authenticated
        if request.user is None or not request.user.is_authenticated:
            return False
        return True

    def has_object_permission(self, request, view, obj):
        """
        A coordinator should be allowed to perform any operation

        Note: This only applies for methods that calls `.get_object()`
        see https://stackoverflow.com/questions/69959797/has-object-permission-not-working-for-detail-action-decorator
        """
        return request.user in obj.coordinators.all()
