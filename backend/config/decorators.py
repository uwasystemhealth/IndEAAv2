from rest_framework.exceptions import ValidationError

from config.errors import APIError
from config.error_codes import APIErrors


def transform_validation_error_to_api_error(callback):
    def wrap(*args, **kwargs):
        try:
            return callback(*args, **kwargs)
        except ValidationError as validation_error:
            raise APIError(APIErrors.INPUT_VALIDATION, api_response_message=validation_error.detail)
        except Exception as other_error:
            raise other_error
    return wrap
