from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from reviews.models import Review
from reviews.serializers import ReviewSerializer

# Create your views here.

class ReviewsViewSet(viewsets.ModelViewSet):
    """
    Viewset that handles the following
    """

    queryset = Review.objects.all()
    def get_serializer(self, *args, **kwargs):
        return ReviewSerializer(*args, **kwargs)
