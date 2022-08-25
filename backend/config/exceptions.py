import logging
from copy import deepcopy

from django.db import Error as DBError
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler

from .error_codes import GENERIC_CODE_ERRORS, APIErrors
from .errors import APIError
from .logs.middleware import get_request_logger


def custom_exception_handler(exc, context):
    """Logs then processes the given exception to return in the JSON format

    {
      "error": {
        "number": 1
        "code": 'FILE_NOT_FOUND',
        "message": "File Not Found",
        "errors": [{
            "reason": "ResourceNotFoundException",
            "message": "File Not Found
        }]
        }
    }
    """
    request = context.get("request", None)
    if request:
        logger = get_request_logger(request)
    else:
        logger = logging.getLogger(__name__)

    # Call REST framework's default exception handler first, to get the standard error response.
    response = exception_handler(exc, context)
    # NOTE if response is None then neither a APIError or rest_framework APIException has been raised, so a
    # 500 Internal Server Error will be returned automatically
    if response is not None:
        if isinstance(exc, APIError):
            error = exc.detail
        elif isinstance(exc, APIException):
            # APIException can be raised by an external library like drf-jwt
            if exc.status_code in GENERIC_CODE_ERRORS:
                # Catch generic errors: 500, 401 to present to the client nicely
                error = deepcopy(GENERIC_CODE_ERRORS[exc.status_code])
                del error["api_response_message"]
                del error["http_status_code"]
                error["message"] = exc.detail
            else:
                # Create a formatted APIException
                error = {"code": exc.status_code, "message": exc.detail, "errors": {}}
        else:
            # Should never enter this else, but just in case
            return response

        # Only log as error if status code is > 500
        if getattr(exc, "status_code", None):
            if exc.status_code >= 500:
                # if exc.is_warning = True -> do not log as error. Default is False
                is_warning = getattr(exc, "is_warning", False)
            else:
                # Always is a warning if code is 2xx or 4xx
                is_warning = True

        custom_log_message = getattr(exc, "log_message", "")
        override_exception = getattr(exc, "override_exception", None)

        log_message = f"Known error raised: {exc} ({custom_log_message})"
        if is_warning:
            logger.warning(log_message)
        else:
            logger.error(log_message, exc_info=override_exception)

        return response

    # By default, the error is an Internal Server Error if not database
    error_to_display = APIErrors.INTERNAL_SERVER_ERROR
    if isinstance(exc, DBError):
        # Exceptions raised in Django DB will be caught here such as interface/database connector and Database Operational Errors
        logger.exception(f"Database Error Occurred: {exc}")
        error_to_display = APIErrors.SERVICE_UNAVAILABLE

    else:
        # When there is no proper response to output then output a generic 500 error
        # log exceptions that cause a 500 internal server error with the full stack trace
        logger.exception(f"Unknown Error Occurred: {exc}")

    response = Response()
    response.status_code = error_to_display["http_status_code"]
    response.data = {
        "number": error_to_display["number"],
        "code": error_to_display["code"],
        "message": error_to_display["api_response_message"],
        "errors": {},
    }
    return response
