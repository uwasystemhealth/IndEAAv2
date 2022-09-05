"""
These serializers are separated due to the amount of imports it uses

The problem of putting these serializers into the usual files is "Circular Import". Hence it is separated
"""
from rest_framework import serializers

from course_evaluations.models import CourseEvaluation
from course_evaluations.serializers.documents import DocumentReadOnlySerializer
from course_evaluations.serializers.eoc import EOCSetSerializer
from course_evaluations.serializers.generic import UserSerializer
from reviews.serializers import ReviewGenericSerializer


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

    """
    We need to make sure that the `justifications` in EOC of this unit always matches the `course_evaluation_id`
    when being read
    """

    def get_eoc_set_serialized_data(self, instance):
        serializer_context = {
            **self.context,
            "course_evaluation_id": instance.id,
        }
        return EOCSetSerializer(instance.eoc_set, context=serializer_context).data
