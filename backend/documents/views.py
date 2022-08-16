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
