from rest_framework import serializers

from course_evaluations.models import CourseEvaluationJustification, EOCSpecific


class JustificationWriteSerializer(serializers.ModelSerializer):
    """
    Note: It is important to understand that this serializer is only used for write operations for the most parts.

    This means that and `eoc_specifics` are expecting the an id (not the EOC number)
    """

    # Note: `read_only=False` is important to do patching and creations
    eoc_specifics = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=EOCSpecific.objects.all())

    # This is not required as we will force this to a value, see `documents.views,py` for `perform_create` and `perform_update`
    course_evaluation = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CourseEvaluationJustification
        fields = "__all__"


class CourseEvaluationJustificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEvaluationJustification
        fields = "__all__"
