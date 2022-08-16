from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from documents.models import Document
from documents.permissions import DocumentCoordinatorAllowAll
from documents.serializers import DocumentSerializer

# Create your views here.


class DocumentsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles documents

    Permissions:
    - Coordinator (ALL)

    Note: A reviewer should only see documents as part of their specific endpoint. See `reviews/serializers.py` or `reviews/views.py`
    """

    queryset = Document.objects.all()
    permission_classes = [DocumentCoordinatorAllowAll]

    def get_serializer(self, *args, **kwargs):
        """ """
        return DocumentSerializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        """
        List only the documents that the user is a coordinator
        """
        queryset = self.filter_queryset(self.get_queryset())

        # Find out all the IDs of the course evaluation at which the user is a coordinator
        course_evaluation_ids = request.user.course_evaluation_coordinator.values_list("id", flat=True)
        filtered_queryset = queryset.filter(
            course_evaluation_id__in=course_evaluation_ids
        )
        serializer = DocumentSerializer(filtered_queryset, many=True)
        return Response(serializer.data)
