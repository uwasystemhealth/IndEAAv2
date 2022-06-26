from django.contrib.auth.models import User
from rest_framework import serializers

from course_evaluations.models import CourseEvaluation, EOCGeneral, EOCSet, EOCSpecific


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "email", "is_staff", "is_active", "is_superuser")


class EOCSpecificSerializer(serializers.ModelSerializer):
    class Meta:
        model = EOCSpecific
        fields = ("id", "number", "eoc_general", "get_general_and_specific_eoc", "description", "indicators_of_attainment")


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


class CourseEvaluationDetailSerializer(serializers.ModelSerializer):
    eoc_set = EOCSetSerializer(read_only=True)
    coordinators = UserSerializer(many=True, read_only=True)

    eoc_set_id = serializers.IntegerField(required=True)

    class Meta:
        model = CourseEvaluation
        fields = "__all__"
