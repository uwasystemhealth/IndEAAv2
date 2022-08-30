from rest_framework import serializers

from course_evaluations.serializers.generic import CourseEvaluationListSerializer
from reviews.models import Review, ReviewDocument, ReviewEocSpecific


class ReviewEOCSpecificSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewEocSpecific
        fields = "__all__"


class ReviewDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewDocument
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    documents = ReviewDocumentSerializer(many=True, read_only=True)
    eoc_specific_reviews = ReviewEOCSpecificSerializer(many=True, read_only=True)
    course_evaluation = CourseEvaluationListSerializer(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"
