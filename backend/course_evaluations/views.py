from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from course_evaluations.models import CourseEvaluation, Document
from course_evaluations.permissions import (
    CourseEvaluationIsCoordinatorAllowAll,
    CourseEvaluationIsCoordinatorAllowAllViaObjectReference,
)
from course_evaluations.serializers import (
    CourseEvaluationDetailSerializer,
    CourseEvaluationListSerializer,
    DocumentReadOnlySerializer,
    DocumentWriteSerializer,
    EOCSet,
)


class CourseEvaluationViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following

    """

    queryset = CourseEvaluation.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
        CourseEvaluationIsCoordinatorAllowAll,
    ]

    def get_serializer(self, *args, **kwargs):
        """
        List action returns a list of groups (reduce info)
        Detail action returns a group with most info
        """
        if self.action == "list":
            return CourseEvaluationListSerializer(*args, **kwargs)
        else:
            return CourseEvaluationDetailSerializer(*args, **kwargs)

    def filter_queryset(self, queryset):
        """
        List only the groups that the user is a coordinator
        """
        return super().filter_queryset(queryset).filter(coordinators=self.request.user)

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
        self.get_object()  # this is to kick off the usual object level permission
        return self.http_method_not_allowed(request, *args, **kwargs)


class CourseEvaluationDocumentViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles documents

    Permissions:
    - Coordinator (DETAIL, CREATE, UPDATE, DELETE). Essentially for management of the documents for a particular course_evaluation

    Note: A reviewer should only see documents as part of their specific endpoint. See `reviews/serializers.py` or `reviews/views.py`
    """

    permission_classes = [
        permissions.IsAuthenticated,
        CourseEvaluationIsCoordinatorAllowAllViaObjectReference,
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
