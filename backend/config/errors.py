from django.forms.utils import ErrorList
from rest_framework.exceptions import APIException


class APIError(APIException):
    def __init__(self, error, api_response_message=None, errors=None, is_warning=False, number=None, log_message=None, override_exception=None):
        """A custom error output for the API.

        :param error: dictionary object of the error, as defined in ApplicationErrors
        :param api_response_message: optional, but it overrides the api response error message defined in the error param
        :param errors: a list/dict of errors to pass back into the response
        :param is_warning: boolean on whether this APIError should be logged as a warning or an error (default)
        :param number: integer to identify the error number inside a specific error code
        :param log_message: Message to be saved in logs
        :param override_exception: Exception that was original raised.

        """
        self.status_code = error["http_status_code"]
        self.detail = {
            "number": number or error.get("number", None),
            "code": error["code"],
            # Custom message first, or fallback to the defined one in `error` (Most likely from APIErrors)
            "message": api_response_message or error["api_response_message"],
        }

        # Extra attributes to send information to the Custom Exception
        # To be used in custom_exception_handler
        self.is_warning = is_warning
        self.override_exception = override_exception
        self.log_message = log_message

        if errors:
            self.detail["errors"] = errors

            # Combine any errors to a key to allow the option of just displaying the
            # 'message' + 'errors' in the client app without looping through or inspecting the error dict
            self.detail["combined_error_message"] = f'{self.detail["message"]}.'
            for error in errors:
                # make the error into a standard django form error to align with validator errors
                if not isinstance(errors[error], ErrorList):
                    errors[error] = ErrorList([errors[error]])
                self.detail["combined_error_message"] += f" {errors[error].as_text()}."
