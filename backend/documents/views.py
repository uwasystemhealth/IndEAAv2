from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from course_evaluations.permissions import CourseEvaluationIsCoordinatorAllowAllViaObjectReference
from documents.models import Document
from documents.serializers import DocumentReadOnlySerializer, DocumentWriteSerializer

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
        CourseEvaluationIsCoordinatorAllowAllViaObjectReference
    ]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return DocumentReadOnlySerializer
        else:
            return DocumentWriteSerializer

    def get_queryset(self):
        return Document.objects.all().filter(course_evaluation=self.kwargs["course_evaluation_id"])

    """
    For CREATE and UPDATE, we have to force the value of 
    `course_evaluation_id` to the url parameters (disregarding what the actual payload was)
    """

    def perform_create(self, serializer):
        serializer.save(course_evaluation_id=self.kwargs["course_evaluation_id"])

    def perform_update(self, serializer):
        serializer.save(course_evaluation_id=self.kwargs["course_evaluation_id"])
