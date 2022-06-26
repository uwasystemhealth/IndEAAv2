from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from course_evaluations.serializers import CourseEvaluationDetailSerializer, CourseEvaluationListSerializer
from course_evaluations.models import CourseEvaluation
from course_evaluations.permissions import IsCoordinatorAllowAll


class CourseEvaluationViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following

    """

    queryset = CourseEvaluation.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsCoordinatorAllowAll]

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
