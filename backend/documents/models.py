import uuid
from django.db import models

# Create your models here.
from course_evaluations.models import EOCSpecific, EOCGeneral

class Document(models.Model):
    """
    A document is a url to a resource that a reviewer will look at 
    to judge the quality of a course
    """

    # UUID for the review
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    is_introduction = models.BooleanField()

    # The actual URL to the resource
    url = models.URLField()

    eoc_generals = models.ManyToManyField(EOCGeneral)
    eoc_specifics = models.ManyToManyField(EOCSpecific)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
