from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from reviews.models import Review, ReviewDocument, ReviewEocSpecific
from reviews.serializers import (
    ReviewDocumentSerializer,
    ReviewEOCSpecificSerializer,
    ReviewSerializer,
)

# Create your views here.


class ReviewsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following
    """

    queryset = Review.objects.all()

    def get_serializer(self, *args, **kwargs):
        return ReviewSerializer(*args, **kwargs)


class ReviewDocumentViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following
    """

    queryset = ReviewDocument.objects.all()

    def get_serializer(self, *args, **kwargs):
        return ReviewDocumentSerializer(*args, **kwargs)


class ReviewEocSpecificViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following
    """

    queryset = ReviewEocSpecific.objects.all()

    def get_serializer(self, *args, **kwargs):
        return ReviewEOCSpecificSerializer(*args, **kwargs)
