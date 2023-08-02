import json

from .utils import get_request_logger


class LogsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def evaluate_path_log_blacklisted(self, path):
        """
        This checks whether a path is blacklisted for payload logging
        This is used to prevent logging of auth tokens and credentials
        """
        blacklist_keywords = ["login", "auth"]

        # Check that the blacklist_keywords for blacklisting path are not recorded
        for keyword in blacklist_keywords:
            # searches the path, and returns either empty of a list of match
            if keyword in path:
                return True

        return False

    def __call__(self, request):
        # Scripts to run before the view call
        # Log all request to Djang App
        logger = get_request_logger(request)
        path = request.path
        method = request.method
        is_path_log_blacklisted = self.evaluate_path_log_blacklisted(path)
        payload = ""

        # Body is always a byte string, convert to ordinary string
        if not (is_path_log_blacklisted):
            try:
                body = request.body.decode("utf-8")
                payload = f"- Request Payload: {json.loads(body)}"
            except Exception:
                # This means that JSON decoding doesn't work because not a JSON
                pass

        log_data = f"Received {method} {path} {payload}"
        logger.info(log_data)

        # This is the Django view call
        response = self.get_response(request)

        # These are lines of codes that will run after the View is Called
        # Log all response from Djang App
        status_code = int(response.status_code)

        # Add Request Payload if it exist as a suffix (Payload from Djang App is always a Object or empty)
        payload = ""
        if hasattr(response, "data") and not (is_path_log_blacklisted):
            payload = f"- Response Payload: {response.data}"

        log_data = f"Sent {status_code} {method} {path} {payload}"
        logger.info(log_data)

        return response
