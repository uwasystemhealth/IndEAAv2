from django.conf import settings
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes, throttle_classes

from config.responses import SuccessfulResponse
from config.throttling import HealthCheckThrottle


@api_view(["GET"])
@throttle_classes([HealthCheckThrottle])
@permission_classes((permissions.AllowAny,))
def status(request):
    """Return the local version stored in the .env file"""

    data = {
        "Application name": settings.APP_NAME,
        "Local version": settings.APP_VER,
        "Application URL": settings.APP_URL,
        "Environment": settings.APP_ENV,
        "Variables": {
            "DJANGO_SETTINGS_MODULE": settings.DJANGO_SETTINGS_MODULE,
            # 'USE_SENTRY': settings.USE_SENTRY,
            # 'SENTRY_ENV': settings.SENTRY_ENV,
            "GITSHORTHASH": settings.GITSHORTHASH,
            "EMAIL_SUBJECT_PREFIX": settings.EMAIL_SUBJECT_PREFIX,
        },
    }

    return SuccessfulResponse("status", data)
