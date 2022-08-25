from django.contrib.auth.models import User
from rest_framework import serializers

from course_evaluations.models import (
    CourseEvaluation,
    CourseEvaluationJustification,
    Document,
    EOCGeneral,
    EOCSet,
    EOCSpecific,
)


class DocumentWriteSerializer(serializers.ModelSerializer):
    """
    Note: It is important to understand that this serializer is only used for write operations for the most parts.

    This means that `eoc_generals` and `eoc_specifics` are expecting the an id (not the EOC number)
    """

    # Note: `read_only=False` is important to do patching and creations
    eoc_generals = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=EOCGeneral.objects.all())
    eoc_specifics = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=EOCSpecific.objects.all())

    # This is not required as we will force this to a value, see `documents.views,py` for `perform_create` and `perform_update`
    course_evaluation = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Document
        fields = "__all__"


class EOCSpecificSerializerReadOnly(serializers.ModelSerializer):
    class Meta:
        model = EOCSpecific
        fields = ("id", "title", "number", "general_and_specific_eoc")


class EOCGeneralSerializerReadOnly(serializers.ModelSerializer):
    class Meta:
        model = EOCGeneral
        fields = ("id", "description", "number")


class DocumentReadOnlySerializer(serializers.ModelSerializer):
    """
    Read only serializer for the Document model.
    """

    eoc_generals = EOCGeneralSerializerReadOnly(
        many=True,
        read_only=True,
    )
    eoc_specifics = EOCSpecificSerializerReadOnly(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Document
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_active",
            "is_superuser",
        )


class EOCSpecificSerializer(serializers.ModelSerializer):
    class Meta:
        model = EOCSpecific
        fields = (
            "id",
            "number",
            "eoc_general",
            "general_and_specific_eoc",
            "description",
            "indicators_of_attainment",
        )


class EOCGeneralSerializer(serializers.ModelSerializer):
    eoc_specifics = EOCSpecificSerializer(many=True, read_only=True, source="eocspecific_set")

    class Meta:
        model = EOCGeneral
        fields = ("id", "number", "title", "eoc_specifics")


class EOCSetSerializer(serializers.ModelSerializer):
    eoc_generals = EOCGeneralSerializer(many=True, read_only=True, source="eocgeneral_set")

    class Meta:
        model = EOCSet
        fields = "__all__"


class CourseEvaluationListSerializer(serializers.ModelSerializer):
    coordinators = UserSerializer(many=True, read_only=True)

    class Meta:
        model = CourseEvaluation
        fields = (
            "id",
            "unit_code",
            "description",
            "coordinators",
        )


class CourseEvaluationJustificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEvaluationJustification
        fields = "__all__"


class CourseEvaluationDetailSerializer(serializers.ModelSerializer):
    eoc_set = EOCSetSerializer(read_only=True)
    coordinators = UserSerializer(many=True, read_only=True)
    course_evalution_justifications = CourseEvaluationJustificationSerializer(many=True, read_only=True)
    documents = DocumentReadOnlySerializer(many=True, read_only=True)

    # Note: This is used for write, by creating the `eoc_set` relationship
    eoc_set_id = serializers.IntegerField(required=True)

    class Meta:
        model = CourseEvaluation
        fields = "__all__"
