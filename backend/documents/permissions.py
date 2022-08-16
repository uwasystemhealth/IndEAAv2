from rest_framework import permissions


class DocumentCoordinatorAllowAll(permissions.BasePermission):
    """
    Custom permission to only allow coordinators the API
    """

    def has_object_permission(self, request, view, obj):
        """
        A coordinator should be allowed to perform any operation
        """

        return request.user in obj.course_evaluation.coordinators.all()
