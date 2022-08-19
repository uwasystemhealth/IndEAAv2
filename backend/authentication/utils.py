import logging

from allauth.account.models import EmailAddress
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth.models import User


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        See:
        - https://stackoverflow.com/questions/19354009/django-allauth-social-login-automatically-linking-social-site-profiles-using-th
        - https://github.com/stencila/hub/pull/474/files#diff-863bcc9035a9f9b19d424fc31e79c45a380189294796b5efc7b17d69e4d08e02

        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed
        (and before the pre_social_login signal is emitted).

        We're trying to solve different use cases:
        - social account already exists, just go on
        - social account has no email or email is unknown, just go on
        - social account's email exists, link social account to existing user
        - no social account, but email already exist
        """
        # Ignore existing social accounts, just do this stuff for new ones
        if sociallogin.is_existing:
            return

        # some social logins don't have an email address, e.g. facebook accounts
        # with mobile numbers only, but allauth takes care of this case so just
        # ignore it
        if "email" not in sociallogin.account.extra_data:
            return

        # check if given email address already exists (both in the providers and in Django admin).
        # Note: __iexact is used to ignore cases
        try:
            email = sociallogin.account.extra_data["email"].lower()
            email_address = EmailAddress.objects.get(email__iexact=email)

            # if it does, connect this new social login to the existing user
            user = email_address.user

        # if it does not, let's check first whether we can find a user with the same email address in Django User
        except EmailAddress.DoesNotExist:
            try:
                logger = logging.getLogger(__name__)
                breakpoint()
                logger.info("No email address found for social login %s", sociallogin)
                user = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                # Just let all auth deal with the login then
                return
            return

        sociallogin.connect(request, user)
