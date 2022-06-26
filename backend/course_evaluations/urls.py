from django.urls import path, include
from rest_framework.routers import DefaultRouter

from course_evaluations.views import CourseEvaluationViewSet


# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'', CourseEvaluationViewSet, basename="course-evaluations")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
