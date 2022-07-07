from django.contrib import admin
from django.urls import include, path
import os

# Authentication
from allauth.socialaccount.providers.google import views as google_views
from google.views import GoogleLogin
import urllib.parse
from django.shortcuts import redirect

api_patterns = (
    [
        path("status/", include("status.urls")),
        path(
            "course-evaluations/",
            include(
                ("course_evaluations.urls", "course_evaluations"),  # (url_location, app_name)
                namespace="course_evaluations",  # use this namespace for url reversal
            ),
        ),
        path("authentication/", include("dj_rest_auth.urls")),
        path('auth/', include('dj_rest_auth.urls')),
        path('auth/registration/', include('dj_rest_auth.registration.urls'))
    ],
    "api",
)

def google_callback(request):
    params = urllib.parse.urlencode(request.GET)
    print(params)
    return redirect(f'http://localhost:3000/auth/google?{params}')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_patterns, namespace="api-v1")),
    path("api-auth/", include("rest_framework.urls")),

    # FIXME: Why do these urls have to be together to avoid invalid callback url?
    path('accounts/', include('allauth.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/', include('google.urls')),
    path('auth/google/', GoogleLogin.as_view()),
    path('auth/google/url/', google_views.oauth2_login),
    path('auth/google/callback/', google_callback, name='google_callback'),
]