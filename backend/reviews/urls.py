from django.urls import include, path
from rest_framework.routers import DefaultRouter

from reviews.views import ReviewsViewSet, ReviewDocumentViewSet, ReviewEocSpecificViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()

"""
Additional Model-Viewset using the ID of the review as a parameter
Note: Additional Model-Viewset needs to go through first due to the order of the route evaluation
"""
router.register(
    r"(?P<review_id>[^/.]+)/documents",
    ReviewDocumentViewSet,
    basename="documents",
)

router.register(
    r"(?P<review_id>[^/.]+)/eoc",
    ReviewEocSpecificViewSet,
    basename="eoc",
)

router.register(r"", ReviewsViewSet, basename="reviews")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
]
