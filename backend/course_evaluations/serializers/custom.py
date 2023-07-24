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
    eoc_set = serializers.SerializerMethodField("get_eoc_set_serialized_data")
    coordinators = UserSerializer(many=True, read_only=True)
    documents = DocumentReadOnlySerializer(many=True, read_only=True)
    reviews = ReviewGenericSerializer(many=True, read_only=True)
    # Note: This is used for write, by creating the `eoc_set` relationship
    eoc_set_id = serializers.IntegerField(required=True)

    class Meta:
        model = CourseEvaluation
        fields = "__all__"

    def get_eoc_set_serialized_data(self, instance):
        """
        We need to make sure that the `justifications` in EOC of this unit always matches the `course_evaluation_id`
        when being read. Context allows passing through nested serializer
        """
        serializer_context = {
            **self.context,
            "course_evaluation_id": instance.id,
        }
        return EOCSetSerializer(instance.eoc_set, context=serializer_context).data

class CourseEvaluationReportSerializer(serializers.ModelSerializer):
    """
    This serializer is used for generating reports
    """
    eoc_set = serializers.SerializerMethodField("get_eoc_set_serialized_data")
    coordinators = UserSerializer(many=True, read_only=True)
    documents = DocumentReadOnlySerializer(many=True, read_only=True)
    reviews = ReviewReportGenericSerializer(many=True, read_only=True)
    # Note: This is used for write, by creating the `eoc_set` relationship
    eoc_set_id = serializers.IntegerField(required=True)

    class Meta:
        model = CourseEvaluation
        fields = "__all__"

    def get_eoc_set_serialized_data(self, instance):
        """
        We need to make sure that the `justifications` in EOC of this unit always matches the `course_evaluation_id`
        when being read. Context allows passing through nested serializer
        """
        serializer_context = {
            **self.context,
            "course_evaluation_id": instance.id,
        }
        return EOCSetSerializer(instance.eoc_set, context=serializer_context).data