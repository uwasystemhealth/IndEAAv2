"""
These serializers are separated due to the amount of imports it uses

The problem of putting these serializers into the usual files is "Circular Import". Hence it is separated
"""
from rest_framework import serializers
from config.settings.base import DATETIME_FORMAT

from course_evaluations.models import CourseEvaluation
from course_evaluations.serializers.documents import DocumentReadOnlySerializer
from course_evaluations.serializers.eoc import EOCSetSerializer
from course_evaluations.serializers.generic import UserSerializer
from reviews.serializers import ReviewGenericSerializer, ReviewReportGenericSerializer


class CourseEvaluationDetailSerializer(serializers.ModelSerializer):
    eoc_set = EOCSetSerializer(read_only=True)
    coordinators = UserSerializer(many=True, read_only=True)
    documents = DocumentReadOnlySerializer(many=True, read_only=True)
    reviews = ReviewGenericSerializer(many=True, read_only=True)
    # Note: This is used for write, by creating the `eoc_set` relationship
    eoc_set_id = serializers.IntegerField(required=True)

    class Meta:
        model = CourseEvaluation
        fields = "__all__"


class CourseEvaluationReportSerializer(CourseEvaluationDetailSerializer):
    reviews = ReviewReportGenericSerializer(many=True, read_only=True)
