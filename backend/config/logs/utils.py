import logging

from django.conf import settings
from django.urls import Resolver404, resolve


class IndEAALogger(logging.Logger):
    """Logger that supports binding a request object that will be used to generate a prefix on all log messages"""

    def __init__(self, name, level=logging.NOTSET):
        super().__init__(name, level)
        self._request = None

    def _log(self, level, msg, args, exc_info=None, extra=None, stack_info=False):
        msg = self._prefix_message(msg)
        super()._log(level, msg, args, exc_info, extra, stack_info)

    def bind_request(self, request):
        self._request = request

    def _prefix_message(self, message):
        """Prefixes the given log message with the current authenticated user's information"""
        request = self._request

        prefix = ""

        # Check if Client-Source header is present. if present, write into log.
        if request and getattr(request, "client_source", None):
            prefix += f"(Source: {request.client_source}) "

        prefix += "Anonymous User"
        if request is not None and request.user is not None:
            # Add User in Request
            if hasattr(request.user, "is_superuser") and request.user.is_superuser:
                prefix = f"Admin (username={request.user.username})"
            elif request.user.is_authenticated:
                prefix = f"User (username={request.user.username})"

        return f"[{settings.APP_NAME}_{settings.APP_VER}] {prefix}: {message} "


def get_request_logger(request):
    """Gets a logger bound to the current view"""
    if not hasattr(request, "logger"):
        # set a logger for this request specific to the matched view function and bind the request to the logger
        if request.resolver_match is not None:
            logger_name = request.resolver_match._func_path
        else:
            # manually call the resolver to get the intended _func_path if it can be found, otherwise simply
            # use the url
            try:
                logger_name = resolve(request.path_info)._func_path
            except Resolver404:
                logger_name = request.path_info
        logger = logging.getLogger(logger_name)
        logger.bind_request(request)
        request.logger = logger

    return request.logger
