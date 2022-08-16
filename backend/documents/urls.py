from django.urls import include, path
from rest_framework.routers import DefaultRouter

from documents.views import DocumentsViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"", DocumentsViewSet, basename="documents")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
]
