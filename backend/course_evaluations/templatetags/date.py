from datetime import datetime

from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()


@register.filter
@stringfilter
def fromisoformat(datestring: str) -> datetime:
    """
    converts iso 8601 date string to datetime object
    used as a workaround for serializers converting the models.DateTimeField
    objects to strings, which cannot be re-formatted by the django date filter.

    Args:
        datestring (str): date string in iso 8601 format

    Returns:
        datetime: datetime object representing datestring
    """
    return datetime.fromisoformat(datestring)
