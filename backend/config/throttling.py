from rest_framework.throttling import AnonRateThrottle


class IndEAAAnonRateThrottle(AnonRateThrottle):
    """ Customized Anonymous Rate due to bug where `request.user.is_authenticated` is not defined to due `request.user` is None
        Which fails the Anonymous Rate Throttling all together. Possibly caused by third-party library for authentication.
        Package: drf-jwt
    """

    def get_cache_key(self, request, view):
        if request is not None and request.user is not None and request.user.is_authenticated:
            return None

        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request)
        }


class HealthCheckThrottle(IndEAAAnonRateThrottle):
    scope = "health_checks"
