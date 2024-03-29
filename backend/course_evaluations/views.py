import pypandoc
from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from course_evaluations.models import (
    CourseEvaluation,
    CourseEvaluationJustification,
    DevelopmentLevels,
    Document,
)
from course_evaluations.permissions import (
    CourseEvaluationIsCoordinatorAllowAllReviewerReadOnly,
    CourseEvaluationIsCoordinatorAllowAllViaObjectReference,
)
from course_evaluations.serializers.custom import CourseEvaluationDetailSerializer
from course_evaluations.serializers.documents import (
    DocumentReadOnlySerializer,
    DocumentWriteSerializer,
)
from course_evaluations.serializers.eoc import EOCSet
from course_evaluations.serializers.generic import CourseEvaluationListSerializer
from course_evaluations.serializers.justifications import JustificationWriteSerializer


class CourseEvaluationViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following

    """

    queryset = CourseEvaluation.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
        CourseEvaluationIsCoordinatorAllowAllReviewerReadOnly,
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
        # Filter to make sure that actions that is not retrieving is subject to filter
        if self.action == "retrieve":
            return super().filter_queryset(queryset)
        else:
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


class CourseEvaluationJustificationsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles Justifications
    Permissions:
    - Coordinator ( CREATE, UPDATE, DELETE). Essentially for management of the Justifications for a particular course_evaluation
    Note: This is only used for WRITE operations
    """

    permission_classes = [
        permissions.IsAuthenticated,
        CourseEvaluationIsCoordinatorAllowAllViaObjectReference,
    ]

    serializer_class = JustificationWriteSerializer

    def list(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def get_queryset(self):
        return CourseEvaluationJustification.objects.all().filter(course_evaluation=self.kwargs["course_evaluation_id"])

    """
    For CREATE and UPDATE, we have to force the value of
    `course_evaluation_id` to the url parameters (disregarding what the actual payload was)
    """

    def enforce_uniqueness_of_a_justification_with_eoc_specifics(self, eoc_specifics, current_justification=None):
        """
        This validation cannot be applied to the model because of the constraint on the field.
        This will maintain the fact that an EOC Specific can only have one justification for a course evaluation.
        """
        for eoc_specific in eoc_specifics:
            # We are excluding the current justification from the query (because it is the justification that is being updated)
            justification_id = current_justification.id if current_justification else None
            if self.get_queryset().filter(eoc_specifics=eoc_specific).exclude(id=justification_id).exists():
                raise ValidationError("EOC Specific {} already has a justification".format(eoc_specific))

    def perform_create(self, serializer):
        course_evaluation_id = self.kwargs["course_evaluation_id"]
        if serializer.validated_data["eoc_specifics"]:
            self.enforce_uniqueness_of_a_justification_with_eoc_specifics(serializer.validated_data["eoc_specifics"])
            serializer.save(course_evaluation_id=course_evaluation_id)
        else:
            raise ValidationError("EOC Specifics cannot be empty")

    def perform_update(self, serializer):
        course_evaluation_id = self.kwargs["course_evaluation_id"]

        # Check that there exist `eoc_specifics` otherwise, delete the justification
        if "eoc_specifics" in serializer.validated_data and serializer.validated_data["eoc_specifics"]:
            self.enforce_uniqueness_of_a_justification_with_eoc_specifics(
                serializer.validated_data["eoc_specifics"],
                current_justification=serializer.instance,
            )
            serializer.save(course_evaluation_id=course_evaluation_id)
        else:
            serializer.instance.delete()


"""
FILE EXPORT
"""

STORAGE_DIRECTORY = "/tmp"


class CourseEvaluationGenerateReport(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
        CourseEvaluationIsCoordinatorAllowAllReviewerReadOnly,
    ]

    serializer_class = DocumentReadOnlySerializer

    def retrieve(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        course_evaluation: CourseEvaluation = CourseEvaluation.objects.get(id=self.kwargs["course_evaluation_id"])

        serialized_data = CourseEvaluationDetailSerializer(course_evaluation).data
        template_data = {
            **serialized_data,
            "course_evaluation": course_evaluation,
            # We can calculate the highest level of EOC here by the maximum integer defined in DevelopmentLevels
            # choice[0] is the integer representation
            "highest_level_of_eoc": max([choice[0] for choice in DevelopmentLevels.choices]),
        }

        md = render_to_string("report/report.md", template_data)

        output_file = f"/tmp/{course_evaluation.id}"
        pypandoc.convert_text(
            md,
            "docx",
            format="md",
            extra_args=[
                "--reference-doc=/app_code/config/custom-reference.docx",
                "--toc",
            ],
            outputfile=output_file,
        )
        with open(output_file, "rb") as f:
            file_content = f.read()
            response = HttpResponse(
                file_content,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
            response["Content-Length"] = len(file_content)
            filename = f"indeaav2-report-{course_evaluation.unit_code}.docx"
            response["Content-Disposition"] = f'attachment; filename="{filename}"'

            # for client-side hack - should not effect security exposing this header to the browser
            response["Access-Control-Expose-Headers"] = "Content-Disposition"
            return response

    def get_queryset(self):
        return CourseEvaluation.objects.all().filter(id=self.kwargs["course_evaluation_id"])
