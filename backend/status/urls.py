from django.urls import path
from rest_framework import routers
from status.views import status


app_name = 'status'
router = routers.DefaultRouter(trailing_slash=False)
urlpatterns = [
    path('', status, name='status'),
]
