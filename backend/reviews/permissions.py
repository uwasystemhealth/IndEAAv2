from rest_framework import permissions


class IsReviewOwnerAllOrCoordinatorReadOnly(permissions.BasePermission):
    """
    Usecase:
    - As a coordinator, I would like to create a Course Review (to indicate that someone is appointed as a reviewer)
    - As a reviewer (owner), I will be able to update my review
    - As a review (not owner), I am not able to do anything
    - As anonymous, I am not able to do anything
    """

    def has_object_permission(self, request, view, obj):
        if request.method is "POST":
            # Check if coordinator
            if request.user in obj.course_evaluation.coordinators.all():
                return True
        else:
            # Reviewer in this context is the associated reviewer in the object
            return request.user == obj.reviewer
        
