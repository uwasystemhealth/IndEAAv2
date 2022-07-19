from django.contrib import admin
from django.urls import include, path

api_patterns = (
    [
        path("status/", include("status.urls")),
        path(
            "course-evaluations/",
            include(
                # (url_location, app_name)
                ("course_evaluations.urls", "course_evaluations"),
                namespace="course_evaluations",  # use this namespace for url reversal
            ),
        ),
        path('authentication/', include('authentication.urls', namespace='authentication'))
    ],
    "api",
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_patterns, namespace="api-v1")),
    path("api-auth/", include("rest_framework.urls")),
]
