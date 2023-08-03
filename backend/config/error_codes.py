from rest_framework import status


class APIErrors:
    INTERNAL_SERVER_ERROR = {
        "number": 1,
        "code": "INTERNAL_SERVER_ERROR",
        "api_response_message": "There was an internal error processing the request",
        "http_status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
    }

    NOT_FOUND = {
        "number": 2,
        "code": "NOT_FOUND",
        "api_response_message": "The resource was not found",
        "http_status_code": status.HTTP_404_NOT_FOUND,
    }

    SERVICE_UNAVAILABLE = {
        "number": 4,
        "code": "SERVICE_UNAVAILABLE",
        "api_response_message": "The service is currently unavailable.",
        "http_status_code": status.HTTP_503_SERVICE_UNAVAILABLE,
    }

    FORBIDDEN = {"number": 5, "code": "FORBIDDEN", "api_response_message": "Forbidden access.", "http_status_code": status.HTTP_403_FORBIDDEN}

    BAD_REQUEST = {"number": 6, "code": "BAD_REQUEST", "api_response_message": "Bad request", "http_status_code": status.HTTP_400_BAD_REQUEST}

    METHOD_NOT_ALLOWED = {
        "number": 7,
        "code": "METHOD_NOT_ALLOWED",
        "api_response_message": "Method not allowed",
        "http_status_code": status.HTTP_405_METHOD_NOT_ALLOWED,
    }

    UNAUTHORIZED = {
        "number": 8,
        "code": "UNAUTHORIZED",
        "api_response_message": "Unauthorized access",
        "http_status_code": status.HTTP_401_UNAUTHORIZED,
    }

    INVALID_OR_EXPIRED_TOKEN = {
        "number": 9,
        "code": "INVALID_OR_EXPIRED_TOKEN",
        "api_response_message": "Unauthorized access. Invalid or Expired Token",
        "http_status_code": status.HTTP_401_UNAUTHORIZED,
    }

    INPUT_VALIDATION = {
        "number": 10,
        "code": "INPUT_VALIDATION",
        "api_response_message": "There was a problem validating your data",
        "http_status_code": status.HTTP_400_BAD_REQUEST,
    }


GENERIC_CODE_ERRORS = {
    500: APIErrors.INTERNAL_SERVER_ERROR,
    401: APIErrors.UNAUTHORIZED,
    503: APIErrors.SERVICE_UNAVAILABLE,
    403: APIErrors.FORBIDDEN,
    400: APIErrors.BAD_REQUEST,
    405: APIErrors.METHOD_NOT_ALLOWED,
}
