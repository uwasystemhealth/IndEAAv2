from rest_framework import viewsets

from reviews.models import Review, ReviewDocument, ReviewEocSpecific
from reviews.serializers import (
    ReviewDocumentSerializer,
    ReviewEOCSpecificSerializer,
    ReviewSerializer,
)


class ReviewsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles Reviews
    """

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def filter_queryset(self, queryset):
        """
        List only the reviews that the user is the reviewer of
        """
        return super().filter_queryset(queryset).filter(reviewer=self.request.user)


class ReviewDocumentViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles Review of Documents within a review
    """

    queryset = ReviewDocument.objects.all()
    serializer_class = ReviewDocumentSerializer


class ReviewEocSpecificViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles Review of EOC Specifics within a review
    """

    queryset = ReviewEocSpecific.objects.all()
    serializer_class = ReviewEOCSpecificSerializer
