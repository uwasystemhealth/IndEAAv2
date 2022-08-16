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
        This is method is not needed. We will never be using a way to list all the documents that the user can view.

        If the role of the user is:
        - Coordinator: the user should use the endpoint at `course_evaluations/views.py`
        - Reviewer: the user should use the endpoint at `reviews/views.py`
        """
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
