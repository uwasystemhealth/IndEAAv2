from django.template.defaultfilters import stringfilter
from datetime import datetime
from django import template

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


@register.filter
@stringfilter
def md_newline(string: str) -> str:
    """adds backslash to line endings so they render as newlines in markdown

    Args:
        string (str): input string which contains '\n' line endings

    Returns:
        str: string formatted to contain backslash at every newline.
    """
    return '\\\n'.join(string.split('\n'))
