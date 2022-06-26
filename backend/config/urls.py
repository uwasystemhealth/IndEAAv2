from django.contrib import admin
from django.urls import include, path

api_patterns = (
    [
        path("status/", include("status.urls")),
        path("course-evaluations/", include("course_evaluations.urls")),
    ],
    "api",
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_patterns, namespace="api-v1")),
    path("api-auth/", include("rest_framework.urls")),
    # path('dj-rest-auth/', include('dj_rest_auth.urls')),
    # path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls'))
]
