from config.exceptions import custom_exception_handler
from config.errors import APIError
from config.error_codes import APIErrors


def test_exceptions_api_error_without_context(mocker):
    """
    GIVEN:  An INPUT_VALIDATIOn exception raised in the API
    WHEN:   The exception doesn't have context request
    AND:    The exception is an API Error
    THEN:   A HTTP response is created with status 400
    AND:    Error Message is equal to the message defined in APIErrors.INPUT_VALIDATION
    AND:    Error Code is equal to the message defined in APIErrors.INPUT_VALIDATION
    """

    exc = APIError(APIErrors.INPUT_VALIDATION)
    context = {}

    response = custom_exception_handler(exc, context)
    assert response.status_code == APIErrors.INPUT_VALIDATION["http_status_code"]
    assert response.data["message"] == APIErrors.INPUT_VALIDATION["api_response_message"]
    assert response.data["code"] == APIErrors.INPUT_VALIDATION["code"]
