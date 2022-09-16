from rest_framework import serializers

from course_evaluations.models import EOCGeneral, EOCSet, EOCSpecific
from course_evaluations.serializers.justifications import (
    CourseEvaluationJustificationSerializer,
)


class EOCSetSerializer(serializers.ModelSerializer):
    class EOCGeneralSerializer(serializers.ModelSerializer):
        class EOCSpecificSerializer(serializers.ModelSerializer):
            # Information to be known by both coordinator and reviewer
            justification = serializers.SerializerMethodField("get_justification_filtered_with_course_evaluation")

            class Meta:
                model = EOCSpecific
                fields = (
                    "id",
                    "number",
                    "eoc_general",
                    "general_and_specific_eoc",
                    "description",
                    "indicators_of_attainment",
                    "justification",
                )

            def get_justification_filtered_with_course_evaluation(self, instance):
                """
                Get the justification for this specific EOC with the course_evaluation_id in the context
                """
                course_evaluation_id = self.context.get("course_evaluation_id")
                filtered_justifications = instance.justification.filter(course_evaluation_id=course_evaluation_id)
                return CourseEvaluationJustificationSerializer(filtered_justifications, many=True).data

        eoc_specifics = EOCSpecificSerializer(many=True, read_only=True, source="eocspecific_set")

        class Meta:
            model = EOCGeneral
            fields = ("id", "number", "title", "eoc_specifics")

    eoc_generals = EOCGeneralSerializer(many=True, read_only=True, source="eocgeneral_set")

    class Meta:
        model = EOCSet
        fields = "__all__"
