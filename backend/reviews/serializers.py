from rest_framework import serializers

from reviews.models import Review, ReviewDocument, ReviewEocSpecific


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ReviewEOCSpecificSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewEocSpecific
        fields = "__all__"


class ReviewDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewDocument
        fields = "__all__"
