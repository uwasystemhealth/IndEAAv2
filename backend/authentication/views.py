from allauth.socialaccount.providers.google import views as google_views
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.urls import reverse
from django.views.generic.base import RedirectView
import urllib

from config.settings.base import FRONTEND_URL, GOOGLE_CLIENT_ID, SOCIALACCOUNT_PROVIDERS


class GoogleLogin(SocialLoginView):
    adapter_class = google_views.GoogleOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(
            reverse('api-v1:authentication:google_callback'))


class GoogleLoginRedirect(RedirectView):
    permanent = True

    def get_redirect_url(self, *args, **kwargs):
        provider_settings = SOCIALACCOUNT_PROVIDERS["google"]
        scope = '+'.join(provider_settings["SCOPE"])
        params = ''
        for k, v in provider_settings["AUTH_PARAMS"].items():
            params += f'&{k}={v}'
        callback_url = self.request.build_absolute_uri(
            reverse('api-v1:authentication:google_callback'))

        return (f"https://accounts.google.com/o/oauth2/v2/auth?redirect_uri={callback_url}&prompt=consent"
                f"&response_type=code&client_id={GOOGLE_CLIENT_ID}&scope={scope}{params}")


class GoogleCallbackRedirect(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        params = urllib.parse.urlencode(self.request.GET)   # Login code
        return f"{FRONTEND_URL}/auth/google?{params}"
