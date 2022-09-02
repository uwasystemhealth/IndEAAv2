"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 3.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""
import logging
import os
from datetime import timedelta
from pathlib import Path

import sentry_sdk
from corsheaders.defaults import default_headers
from decouple import config
from sentry_sdk.integrations.django import DjangoIntegration

from config.logs.utils import IndEAALogger

############
# Env Config
############
APP_NAME = config("APP_NAME", "not-set")
APP_ENV = config("APP_ENV", "not-set")
APP_VER = config("APP_VER", "not-set")
APP_URL = config("APP_URL", "not-set")
DJANGO_SETTINGS_MODULE = config("DJANGO_SETTINGS_MODULE", "config.settings.base")


####################
# Django Core Config
####################

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent  # <-- '/config
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # <- '/' directory

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = []

LOGOUT_REDIRECT_URL = "/admin/login/"
LOGIN_REDIRECT_URL = "/"

DATETIME_FORMAT = "d/m/Y H:i:s"
DATETIME_INPUT_FORMATS = ["%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_filters",
    "commands",
    "course_evaluations",
    "reviews",
    # Authentication
    "rest_framework",
    "rest_framework.authtoken",
    "django.contrib.sites",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
]

# Refer to https://dj-rest-auth.readthedocs.io/en/latest/installation.html#registration-optional
SITE_ID = 1

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "config.logs.middleware.LogsMiddleware",
    "log_request_id.middleware.RequestIDMiddleware",
    "config.security.ExtraSecurityHeadersMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(PROJECT_ROOT, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "config.wsgi.application"

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

POSTGRES_URL = config("POSTGRES_URL", "not-set")
POSTGRES_DB = config("POSTGRES_DB", "not-set")
POSTGRES_PORT = config("POSTGRES_PORT", "not-set")
POSTGRES_USER = config("POSTGRES_USER", "not-set")
POSTGRES_PASSWORD = config("POSTGRES_PASSWORD", "not-set")

# Refer to https://django-allauth.readthedocs.io/en/latest/configuration.html#configuration
ACCOUNT_AUTHENTICATION_METHOD = "username_email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
]

GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID", "not-set")
GOOGLE_SECRET = config("GOOGLE_SECRET", "not-set")

SOCIALACCOUNT_ADAPTER = "authentication.utils.SocialAccountAdapter"
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": GOOGLE_CLIENT_ID,
            "secret": GOOGLE_SECRET,
            "key": "",
        },
        # These are provider-specific settings that can only be
        # listed here:
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "offline",
        },
    }
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": POSTGRES_DB,
        "USER": POSTGRES_USER,
        "PASSWORD": POSTGRES_PASSWORD,
        "HOST": POSTGRES_URL,
        "PORT": POSTGRES_PORT,
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


########################################################################################################################
# Django Internationalization Config
########################################################################################################################
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Australia/Perth"
USE_I18N = True
USE_L10N = False
USE_TZ = True


############################
# Django Static Files Config
############################
STATIC_URL = "/static/"

# STATIC_ROOT is where the static files get copied to when "collectstatic" is run.
STATIC_ROOT = os.path.join(PROJECT_ROOT, "static_files")

# This is where to _find_ static files when 'collectstatic' is run.
# These files are then copied to the STATIC_ROOT location.
STATICFILES_DIRS = (os.path.join(PROJECT_ROOT, "static"),)


############################
# Uploaded documents and split files
############################
# In development, we use the filesystem which stores files in the MEDIA_ROOT, i.e. /media
# DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
# MEDIA_URL = "/media/"
# MEDIA_ROOT = os.path.join(PROJECT_ROOT, "media")

# # In test / production, we use Amazon S3
# USE_AWS_S3 = config('USE_AWS_S3', default=False, cast=bool)
# if USE_AWS_S3:
#     DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
#     AWS_S3_ACCESS_KEY_ID = config('AWS_S3_ACCESS_KEY_ID')
#     AWS_S3_SECRET_ACCESS_KEY = config('AWS_S3_SECRET_ACCESS_KEY')
#     AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
#     AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', 'ap-southeast-2')

#############################
# JWT & Rest Framework Config
#############################
REST_USE_JWT = True

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=365 * 3),
}

# Configuration for modifying the Serialisers for authentication
# https://dj-rest-auth.readthedocs.io/en/latest/configuration.html#configuration
JWT_AUTH_COOKIE = "access-token"
JWT_AUTH_REFRESH_COOKIE = "refresh-token"

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        # SessionAuthentication is needed for Browsable API however conflicts with dj-rest-auth
        # 'rest_framework.authentication.SessionAuthentication',
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "config.throttling.IndEAAAnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": config("THROTTLE_RATES_ANON", default="100/minute"),
        "health_checks": config("THROTTLE_RATES_HEALTH_CHECKS", default="100000/day"),
    },
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.NamespaceVersioning",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 100,
    "EXCEPTION_HANDLER": "config.exceptions.custom_exception_handler",
}

#######################
# Django Logging Config
#######################

ENABLE_LOG_DJANGO_QUERIES = config("ENABLE_LOG_DJANGO_QUERIES", False, cast=bool)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"request_id": {"()": "log_request_id.filters.RequestIDFilter"}},
    "formatters": {
        "standard": {"format": "[%(asctime)s] [%(request_id)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s"},
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "filters": ["request_id"],
            "formatter": "standard",
        },
        "no_output": {
            "level": "DEBUG",
            "class": "logging.NullHandler",
        },
    },
    "loggers": {
        "": {
            "level": "INFO",
            "handlers": ["console"],
        },
    },
}


if ENABLE_LOG_DJANGO_QUERIES:
    LOGGING["loggers"]["django.db.backends"] = {"level": "DEBUG"}

###############
# Sentry Config
###############
USE_SENTRY = config("USE_SENTRY", default=False, cast=bool)
SENTRY_DSN_BACKEND = config("SENTRY_DSN_BACKEND", None)
SENTRY_ENV = config("SENTRY_ENV", None)
SENTRY_TRACE_RATE = config("SENTRY_TRACE_RATE", 0.1, cast=float)
SENTRY_VERSION = sentry_sdk.VERSION


def traces_sampler(sampling_context):
    """Only activate trace sampler for specific endpoints"""
    ENDPOINTS_TO_IGNORE = ["/api/v1/status/"]
    try:
        if "wsgi_environ" in sampling_context and sampling_context["wsgi_environ"]["PATH_INFO"] not in ENDPOINTS_TO_IGNORE:
            return SENTRY_TRACE_RATE
        return 0
    except Exception as exp:
        logger = logging.getLogger("traces_sampler")
        logger.error(f"Error trying to configure performance trace sampler for Sentry {exp}")
        return 0


if USE_SENTRY:
    sentry_sdk.init(
        dsn=SENTRY_DSN_BACKEND,
        environment=SENTRY_ENV,
        release=APP_VER,
        send_default_pii=True,
        integrations=[DjangoIntegration()],
        traces_sampler=traces_sampler,
    )

#############
# CORS Config
#############
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ["sentry-trace", *list(default_headers)]  # passed by staging
FRONTEND_URL = config("FRONTEND_URL", "http://localhost:11002")
CORS_ALLOWED_ORIGINS = [FRONTEND_URL]


######################################
# App Versioning & Watermarking Config
######################################
root = lambda *x: os.path.join(PROJECT_ROOT, *x)  # noqa

git_short_hash_filename = "gitshorthash"
if os.path.exists(git_short_hash_filename):
    with open(root(git_short_hash_filename)) as f:
        GITSHORTHASH = f.read().strip()
else:
    GITSHORTHASH = "Unknown"

ci_build_number_filename = "cibuildnumber"
if os.path.exists(ci_build_number_filename):
    with open(root(ci_build_number_filename)) as f:
        CIBUILDNUMBER = f.read().strip()
else:
    CIBUILDNUMBER = "Unknown"

ci_build_datetime_filename = "cibuildnumber"
if os.path.exists(ci_build_datetime_filename):
    with open(root(ci_build_datetime_filename)) as f:
        CIBUILDDATETIME = f.read().strip()
else:
    CIBUILDDATETIME = "Unknown"

##################
# Set Logger Class
##################

logging.setLoggerClass(IndEAALogger)

##############
# Email Config
##############
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", "")
EMAIL_HOST_USER = config("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", "")
EMAIL_PORT = config("EMAIL_PORT", "587", cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", True, cast=bool)
EMAIL_TIMEOUT = config("EMAIL_TIMEOUT", default=20, cast=int)

EMAIL_ADDRESS_FROM = config("EMAIL_ADDRESS_FROM", "noreply-indeaa@systemhealthlab.com")

# This string is prefixed to the beginning of every email (subject).
EMAIL_SUBJECT_PREFIX = f"[IndEAA {APP_ENV}] "

###################
# Use HTTPS headers
###################

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
