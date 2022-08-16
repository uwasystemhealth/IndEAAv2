from rest_framework import serializers

from course_evaluations.models import (
    CourseEvaluation,
    CourseEvaluationJustification,
    EOCGeneral,
    EOCSet,
    EOCSpecific,
)
from documents.models import Document


class DocumentSerializer(serializers.ModelSerializer):
    """
    Note: It is important to understand that this serializer is only used for write operations for the most parts.

    This means that `eoc_generals` and `eoc_specifics` are expecting the an id (not the EOC number)
    """

    # Note: `read_only=False` is important to do patching and creations
    eoc_generals = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=EOCGeneral.objects.all())
    eoc_specifics = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=EOCSpecific.objects.all())

    class Meta:
        model = Document
        fields = "__all__"
