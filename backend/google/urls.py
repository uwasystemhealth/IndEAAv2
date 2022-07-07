
import os
import urllib.parse

from allauth.socialaccount.providers.google import views as google_views
from django.urls import include, path
from rest_framework import routers
from google.views import GoogleLogin



app_name = "google"
router = routers.DefaultRouter(trailing_slash=False)
urlpatterns = [
    # path('auth/', include('dj_rest_auth.urls')),
    # path('auth/', include('google.urls'))
    # path('auth/registration/', include('dj_rest_auth.registration.urls'))

]
