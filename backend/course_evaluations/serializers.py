from rest_framework import serializers

from django.contrib.auth.models import User
from course_evaluations.models import EOCSet, EOCGeneral, EOCSpecific, CourseEvaluation

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'is_superuser')

class EOCSpecificSerializer(serializers.ModelSerializer):
    class Meta:
        model = EOCSpecific
        # All fields will be read only as API doesn't need to modify this
        fields = "__all__"
        read_only_fields = "__all__"

class EOCGeneralSerializer(serializers.ModelSerializer):
    eoc_specifics = EOCSpecificSerializer(many=True, read_only=True)

    class Meta:
        model = EOCGeneral
        # All fields will be read only as API doesn't need to modify this
        fields = "__all__"
        read_only_fields = "__all__"

class EOCSetSerializer(serializers.ModelSerializer):
    eoc_generals = EOCGeneralSerializer(many=True, read_only=True)

    class Meta:
        model = EOCSet
        # All fields will be read only as API doesn't need to modify this
        fields = "__all__"
        read_only_fields = "__all__"

class CourseEvaluationListSerializer(serializers.ModelSerializer):
    coordinators = UserSerializer(many=True, read_only=True)

    class Meta:
        model = CourseEvaluation
        fields = ("id", "unit_code", "description", "coordinators")

class CourseEvaluationDetailSerializer(serializers.ModelSerializer):
    eoc_set = EOCSetSerializer(read_only=True)
    coordinators = UserSerializer(many=True, read_only=True)

    class Meta:
        model = CourseEvaluation
        fields = "__all__"