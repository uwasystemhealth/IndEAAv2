from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from documents.models import Documents
# from documents.permissions import IsCoordinatorAllowAll
from documents.serializers import DocumentsDetailSerializer, DocumentsListSerializer


class DocumentsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following

    """

    queryset = Documents.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        """
        List action returns a list of groups (reduce info)
        Detail action returns a group with most info
        """
        if self.action == "list":
            return DocumentsListSerializer(*args, **kwargs)
        else:
            return DocumentsDetailSerializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        """
        List only the groups that the user is a coordinator
        """
        queryset = self.filter_queryset(self.get_queryset())
        # filtered_queryset = queryset.filter(coordinators=request.user)
        # serializer = DocumentsListSerializer(filtered_queryset, many=True)
        serializer = DocumentsListSerializer(queryset, many=True)
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
