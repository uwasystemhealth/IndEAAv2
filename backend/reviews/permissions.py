from rest_framework import permissions


class IsReviewOwnerAllOrCoordinatorReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it or read only by coordinators.
    Note: This is a modified version of https://www.django-rest-framework.org/tutorial/4-authentication-and-permissions/#object-level-permissions
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if request.user in obj.course_evaluation.coordinators.all():
                return True
            
        # Write permissions only for the owner
        return obj.reviewer == request.user
