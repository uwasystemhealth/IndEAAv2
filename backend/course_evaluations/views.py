from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from course_evaluations.models import CourseEvaluation
from course_evaluations.permissions import IsCoordinatorAllowAll
from course_evaluations.serializers import (
    CourseEvaluationDetailSerializer,
    CourseEvaluationListSerializer,
    EOCSet,
)


class CourseEvaluationViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following

    """

    queryset = CourseEvaluation.objects.all()
    # TODO: Change permission
    permission_classes = [permissions.AllowAny]  # [permissions.IsAuthenticated, IsCoordinatorAllowAll]
    # permission_classes = [permissions.IsAuthenticated, IsCoordinatorAllowAll]

    def get_serializer(self, *args, **kwargs):
        """
        List action returns a list of groups (reduce info)
        Detail action returns a group with most info
        """
        if self.action == "list":
            return CourseEvaluationListSerializer(*args, **kwargs)
        else:
            return CourseEvaluationDetailSerializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        """
        List only the groups that the user is a coordinator
        """
        queryset = self.filter_queryset(self.get_queryset())
        filtered_queryset = queryset.filter(coordinators=request.user)
        serializer = CourseEvaluationListSerializer(filtered_queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if "eoc_set" in request.data:
            request.data["eoc_set_id"] = request.data["eoc_set"]

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check EOC Set exists first
        data = serializer.validated_data
        eoc_set_id = data["eoc_set_id"]
        if not EOCSet.objects.filter(id=eoc_set_id).exists():
            raise ValidationError("EOC Set does not exist")

        serializer.save(coordinators=[request.user])
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        """
        Deletion of a Course Evaluation should never be allowed
        """
        return self.http_method_not_allowed(request, *args, **kwargs)
