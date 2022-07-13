
import urllib.parse

from allauth.socialaccount.providers.google import views as google_views
from django.urls import include, path
from django.shortcuts import redirect
from rest_framework import routers
from authentication.views import GoogleLogin

FRONTEND_URL = "http://localhost:3000/auth/google"

def google_callback(request):
    params = urllib.parse.urlencode(request.GET)
    print(params)
    return redirect(f'{FRONTEND_URL}?{params}')


google_patterns = [
    path('', GoogleLogin.as_view()),
    path('login/', google_views.oauth2_login),
    path('login/callback/', google_callback, name='google_callback'),
]

app_name = "google"
router = routers.DefaultRouter(trailing_slash=False)
urlpatterns = [
    path('', include("dj_rest_auth.urls")),
    path('google/', include(google_patterns)),
    path('registration/', include('dj_rest_auth.registration.urls')),
]
