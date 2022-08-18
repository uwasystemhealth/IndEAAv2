from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from documents.models import Document
from documents.permissions import DocumentCoordinatorAllowAllReviewerReadOnly
from documents.serializers import DocumentSerializer

# Create your views here.


class CourseEvaluationDocumentViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles documents

    Permissions:
    - Coordinator (DETAIL, CREATE, UPDATE, DELETE). Essentially for management of the documents for a particular course_evaluation

    Note: A reviewer should only see documents as part of their specific endpoint. See `reviews/serializers.py` or `reviews/views.py`
    """

    permission_classes = [
        permissions.IsAuthenticated,
        DocumentCoordinatorAllowAllReviewerReadOnly,
    ]
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return Document.objects.all().filter(course_evaluation=self.kwargs["course_evaluation_id"])
