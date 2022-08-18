from rest_framework import permissions


class IsReviewOwnerAllOrCoordinatorReadOnly(permissions.BasePermission):
    """
    Usecase:
    - As a coordinator, I would like to create/delete a Course Review (to indicate that someone is appointed/removed as a reviewer)
    - As a coordinator, I would like to open the submission
    - As a reviewer (owner), I will be able to update my review
    - As a review (not owner), I am not able to do anything
    - As anonymous, I am not able to do anything
    """

    def has_object_permission(self, request, view, obj):
        # A coordinator can do anything
        if request.user in obj.course_evaluation.coordinators.all():
            return True

        # Reviewer in this context is the associated reviewer in the object
        return request.user == obj.reviewer
