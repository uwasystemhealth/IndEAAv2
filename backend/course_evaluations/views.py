from django.template.loader import render_to_string
from django.forms.models import model_to_dict
from django.shortcuts import render
import imp
import time
from typing import Any, Dict, List

import pypandoc
from django.contrib.auth.models import User
from django.db.models.query import QuerySet
from django.http import HttpResponse
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from course_evaluations.models import (
    CourseEvaluation,
    CourseEvaluationJustification,
    Document,
)
from course_evaluations.permissions import (
    CourseEvaluationIsCoordinatorAllowAllReviewerReadOnly,
    CourseEvaluationIsCoordinatorAllowAllViaObjectReference,
)
from course_evaluations.serializers.custom import CourseEvaluationDetailSerializer, CourseEvaluationReportSerializer
from course_evaluations.serializers.documents import (
    DocumentReadOnlySerializer,
    DocumentWriteSerializer,
)
from course_evaluations.serializers.eoc import EOCSet
from course_evaluations.serializers.generic import CourseEvaluationListSerializer
from course_evaluations.serializers.justifications import JustificationWriteSerializer
from reviews.models import Review, ReviewDocument, ReviewEocSpecific


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
        CourseEvaluationIsCoordinatorAllowAllViaObjectReference,
    ]

    serializer_class = DocumentReadOnlySerializer

    def retrieve(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """
        List only the groups that the user is a coordinator
        """
        PLAIN_TEXT = 1  # TODO: REMOVE

        # TODO: GET THE RIGHT COURSE EVALUATION FROM THE ID.
        course_evaluation: CourseEvaluation = self.get_queryset().first()

        obj = CourseEvaluationReportSerializer(course_evaluation).data

        md = render_to_string('report/report.md', obj)

        if PLAIN_TEXT:
            from pprint import pprint
            pprint(obj)
            # print(Document.objects.filter(course_evaluation=course_evaluation.id))
            return HttpResponse(md, content_type='text/plain')
        else:
            output = pypandoc.convert_text(md, 'docx', format='md', extra_args=['--reference-doc=/app_code/config/custom-reference.docx'])
            
            response = HttpResponse(output, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            response['Content-Length'] = len(output)
            response['Content-Disposition'] = 'attachment; filename="somefile.docx"'
            return response


    def get_queryset(self):
        return CourseEvaluation.objects.all().filter(id=self.kwargs["course_evaluation_id"])


def userlist_to_md(users: List[User]) -> str:
    users_str = ""
    for user in users:
        users_str += f"- {user.username} <{user.email}>\n" if user.username else f"- {user.email}\n"
    return users_str


def document_to_md(documents: List[Document]) -> str:
    documents_str = ""
    for document in documents:
        documents_str += f"""
# Document: {document.name}

> {document.description or 'Document has no description'}

"""
        if document.url:
            documents_str += f"Link: [Click here]({document.url})\n\n"
        else:
            documents_str += 'Document has no link\n\n'

        documents_str += f"EOC generals: {', '.join(map(str,document.eoc_generals.values_list('number',flat=True)))}\n\n"
        documents_str += f"EOC specifics: {', '.join([eoc.general_and_specific_eoc() for eoc in document.eoc_specifics.all()])}\n\n"

        documents_str += "\n"
    return documents_str


def generate_report_md(course_evaluation: CourseEvaluation) -> str:
    coordinators: QuerySet = course_evaluation.coordinators.all()
    reviewers: QuerySet = User.objects.filter(pk__in=course_evaluation.reviews.values_list('reviewer'))

    coordinators_str = userlist_to_md(coordinators.all())
    reviewers_str = userlist_to_md(reviewers.all())

    return (f"""
---
title: Course Evaluation Report - {course_evaluation.unit_code}
abstract: This is the course evaluation report that encompasses the reviews of the unit towards the Elements of Competencies.
author: Automatically generated by [IndEAA](https://indeaa.systemhealthlab.com/)
date: {time.strftime('%Y-%m-%d %H:%M:%S')}
---
# Course Information

{course_evaluation.description}

Coordinators:

{coordinators_str}

Reviewers:

{reviewers_str}

# Elements of Competencies

// TODO

# Documents Attached are:

{document_to_md(course_evaluation.documents.all())}

# Coordinator Review Justification

// TODO: This needs to be changed with the EOC stuff later
"""

            # {course_evaluation.eoc.map(remarks =>`
            # ## Justification for EOC: {remarks.eocNumber.join(', ')}
            # Development Level: {remarks.developmentLevel ? `{remarks.developmentLevel} - {DEVELOPMENT_LEVEL[remarks.developmentLevel - 1].short}` :
            #       'Coordinator has not rated the development Level'}
            # Justification:
            # > {remarks.justification}
            # `).join('\n')}
            # # Review
            # {reviews.map(review =>`
            # ## Review of {review.user_id.name}
            # Read the Development Levels on: {review.step1DevelopmentLevels || 'Reviewer has not confirmed reading the development levels'}
            # ### General Comment
            # > {review.step4ReviewComment || 'Reviewer has no general comment'}
            # ### Documents Review
            # {review.step2Documents.map(documentReview => `
            # { documentReview.comment ? `#### Review for document {documentReview.document_id}
            # > {documentReview.comment || 'Reviewer has no comment for document'}
            # Finished Reviewed On: {documentReview.finishedReviewedOn || 'Reviewer has not marked finished reviewing document'}
            # `: ''}`).join('\n') || '>  Reviewer has not reviewed the documents'}
            # ### Element of Competencies Review
            # {review.step3Evaluation.map(eocReview =>`
            # #### EOC {eocReview.eoc}
            # Rating: {eocReview.rating ? `{eocReview.rating} - {DEVELOPMENT_LEVEL[eocReview.rating - 1].short}` : 'Reviewer has not rated the EOC'}
            # Reason:
            # > {eocReview.reason || 'Reviewer did not provide reason'}
            # Idea for Improvement:
            # > {eocReview.ideaForImprovement ||'Reviewer did not give suggestion'}
            # `).join('\n') || '> Reviewer has not evaluated any Elements of Competency'}
            # ***
            # `).join('\n')}
            )
