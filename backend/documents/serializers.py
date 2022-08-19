from rest_framework import serializers
from course_evaluations.models import EOCGeneral, EOCSpecific

from documents.models import Documents


class EOCSpecificListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EOCSpecific
        fields = "__all__"


class EOCGeneralListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EOCGeneral
        fields = "__all__"


class DocumentsListSerializer(serializers.ModelSerializer):
    eocSpecific = EOCSpecificListSerializer(many=True)
    eocGeneral = EOCGeneralListSerializer(many=True)

    class Meta:
        model = Documents
        fields = ("id", "name", "link", "description", "isInIntroduction", "eocGeneral", "eocSpecific")


class DocumentsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = "__all__"
