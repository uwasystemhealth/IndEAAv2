from django.contrib.auth.models import User
from rest_framework import serializers

from course_evaluations.models import CourseEvaluation


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
