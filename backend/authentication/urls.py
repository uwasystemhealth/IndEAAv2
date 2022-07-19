from allauth.socialaccount.providers.google import views as google_views
from django.urls import include, path
from rest_framework import routers

from authentication.views import (
    GoogleCallbackRedirect,
    GoogleLogin,
    GoogleLoginRedirect,
)

google_patterns = [
    path("login/callback/", GoogleCallbackRedirect.as_view(), name="google_callback"),
    path("", GoogleLogin.as_view()),
    path("login/", google_views.oauth2_login),
    path("login/redirect/", GoogleLoginRedirect.as_view()),
]

app_name = "google"
router = routers.DefaultRouter(trailing_slash=False)
urlpatterns = [
    path("", include("dj_rest_auth.urls")),
    path("google/", include(google_patterns)),
    path("registration/", include("dj_rest_auth.registration.urls")),
]
