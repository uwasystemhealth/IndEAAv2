from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from documents.models import Document
from documents.serializers import DocumentSerializer

# Create your views here.


class DocumentsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles documents
    """

    queryset = Document.objects.all()

    def get_serializer(self, *args, **kwargs):
        """ """
        return DocumentSerializer(*args, **kwargs)
