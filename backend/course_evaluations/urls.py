from django.urls import include, path
from rest_framework.routers import DefaultRouter

from course_evaluations.views import (
    CourseEvaluationDocumentViewSet,
    CourseEvaluationGenerateReport,
    CourseEvaluationViewSet,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
"""
Additional Model-Viewset using the ID of the course evaluation as a parameter
Note: Additional Model-Viewset needs to go through first due to the order of the route evaluation
"""
router.register(
    r"(?P<course_evaluation_id>[^/.]+)/documents",
    CourseEvaluationDocumentViewSet,
    basename="documents",
)

router.register(
    r"download/(?P<course_evaluation_id>[^/.]+)",
    CourseEvaluationGenerateReport,
    basename="download",
)
router.register(r"", CourseEvaluationViewSet, basename="course-evaluations")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
]
