from rest_framework import permissions, viewsets

from reviews.models import Review, ReviewDocument, ReviewEocSpecific
from reviews.permissions import (
    IsReviewOwnerAllOrCoordinator,
    IsReviewOwnerAllOrCoordinatorViaObjectReference,
)
from reviews.serializers import (
    ReviewCreateSerializer,
    ReviewDocumentSerializer,
    ReviewEOCSpecificSerializer,
    ReviewGenericSerializer,
)


class ReviewsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles Reviews
    """

    queryset = Review.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsReviewOwnerAllOrCoordinator]

    def get_serializer_class(self):
        """
        Return the appropriate serializer class based on the request method
        """
        if self.request.method == "POST":
            return ReviewCreateSerializer
        return ReviewGenericSerializer

    def filter_queryset(self, queryset):
        """
        List only the reviews that the user is the reviewer of

        Note: For coordinators, they still need to use this view (not the list one)
        """
        if self.action == "list":
            return super().filter_queryset(queryset).filter(reviewer=self.request.user)
        else:
            return super().filter_queryset(queryset)


class ReviewDocumentViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles Review of Documents within a review.

    Note: Only used for Write Operations
    """

    queryset = ReviewDocument.objects.all()
    serializer_class = ReviewDocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsReviewOwnerAllOrCoordinatorViaObjectReference]

    def list(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(review_id=self.kwargs["review_id"])

    def perform_update(self, serializer):
        serializer.save(review_id=self.kwargs["review_id"])


class ReviewEocSpecificViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles Review of EOC Specifics within a review

    Note: Only used for Write Operations
    """

    queryset = ReviewEocSpecific.objects.all()
    serializer_class = ReviewEOCSpecificSerializer
    permission_classes = [permissions.IsAuthenticated, IsReviewOwnerAllOrCoordinatorViaObjectReference]

    def list(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        raise self.http_method_not_allowed(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(review_id=self.kwargs["review_id"])

    def perform_update(self, serializer):
        serializer.save(review_id=self.kwargs["review_id"])
