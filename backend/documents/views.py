from django.http import HttpRequest
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from course_evaluations.permissions import IsCoordinatorAllowAll

from documents.models import Documents
# from documents.permissions import IsCoordinatorAllowAll
from documents.serializers import DocumentsDetailSerializer, DocumentsListSerializer


class DocumentsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following

    """

    queryset = Documents.objects.all()
    # TODO: Change permission
    permission_classes = [permissions.AllowAny]  # [permissions.IsAuthenticated, IsCoordinatorAllowAll]

    def get_serializer(self, *args, **kwargs):
        """
        List action returns a list of groups (reduce info)
        Detail action returns a group with most info
        """
        if self.action == "list":
            return DocumentsListSerializer(*args, **kwargs)
        else:
            return DocumentsDetailSerializer(*args, **kwargs)

    def list(self, request: HttpRequest, *args, **kwargs):
        """
        List only the groups that the user is a coordinator
        """
        queryset = self.filter_queryset(self.get_queryset())
        filtered_queryset = queryset.filter(
            courseEvaluation__id=request.GET.get("Course-Evaluation-Id"),
            # courseEvaluation__coordinators=request.user
        )
        serializer = DocumentsListSerializer(filtered_queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        """
        Deletion of a Course Evaluation should never be allowed
        """
        return self.http_method_not_allowed(request, *args, **kwargs)
