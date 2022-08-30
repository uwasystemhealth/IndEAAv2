from allauth.account.models import EmailAddress
from django.contrib.auth.models import User
from rest_framework import serializers

from course_evaluations.models import CourseEvaluation
from course_evaluations.serializers.generic import (
    CourseEvaluationListSerializer,
    UserSerializer,
)
from reviews.models import Review, ReviewDocument, ReviewEocSpecific


class ReviewEOCSpecificSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewEocSpecific
        fields = "__all__"


class ReviewDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewDocument
        fields = "__all__"


class ReviewGenericSerializer(serializers.ModelSerializer):
    documents = ReviewDocumentSerializer(many=True, read_only=True)
    eoc_specific_reviews = ReviewEOCSpecificSerializer(many=True, read_only=True)
    course_evaluation = CourseEvaluationListSerializer(read_only=True)
    reviewer = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"


class ReviewCreateSerializer(serializers.ModelSerializer):
    """
    Special serializer that allows `email` as input for the `reviewer` field.
    """

    email = serializers.EmailField(write_only=True)
    course_evaluation = serializers.PrimaryKeyRelatedField(queryset=CourseEvaluation.objects.all(), write_only=True)

    class Meta:
        model = Review
        fields = ["email", "course_evaluation"]

    def create(self, validated_data):
        """
        We are overwriting this to allow `email` to be used as input.
        We search whether it exist first as a user and if not, we create a new user.

        Scenarios:
        1. Oauth User (will exist in 2 models - django.contrib.auth.models.User, allauth.account.models.EmailAddress )
        2. User manually created
        """
        email = validated_data.pop("email")
        course_evaluation = validated_data.pop("course_evaluation")
        user = User.objects.filter(email=email).first()
        if not user:
            user = User.objects.create(username=email, email=email)
            EmailAddress.objects.create(user=user, email=email, primary=True, verified=True)
        # Serialize using the generic serializer to create the review
        review = Review.objects.create(reviewer=user, course_evaluation=course_evaluation)
        return ReviewGenericSerializer(review)
