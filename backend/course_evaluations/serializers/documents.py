from rest_framework import serializers

from course_evaluations.models import Document, EOCGeneral, EOCSpecific


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


class DocumentReadOnlySerializer(serializers.ModelSerializer):
    """
    Read only serializer for the Document model.
    """

    class EOCSpecificSerializerReadOnly(serializers.ModelSerializer):
        class Meta:
            model = EOCSpecific
            fields = ("id", "description", "number", "general_and_specific_eoc")

    class EOCGeneralSerializerReadOnly(serializers.ModelSerializer):
        class Meta:
            model = EOCGeneral
            fields = ("id", "title", "number")

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
