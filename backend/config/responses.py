from rest_framework.response import Response
from rest_framework import status


class CustomApiResponse(Response):
    """
    Sample of how a CustomApiResponse should look like

    {
        "message": "User registered",
        "data": {
            ...
        }
    }
    Usage: return CustomApiResponse(status.HTTP_200_OK, 'test', {})
    """

    def __init__(self, status, message, data, **kwargs):
        super().__init__(data={'data': data, 'message': message}, status=status, **kwargs)


class SuccessfulResponse(CustomApiResponse):
    def __init__(self, message, data, status=status.HTTP_200_OK, **kwargs):
        super().__init__(status, message, data, **kwargs)
