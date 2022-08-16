import uuid

from django.db import models

# Create your models here.
from course_evaluations.models import CourseEvaluation, EOCGeneral, EOCSpecific


class Document(models.Model):
    """
    A document is a url to a resource that a reviewer will look at
    to judge the quality of a course
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Main relations
    course_evaluation = models.ForeignKey(CourseEvaluation, on_delete=models.CASCADE)

    # Information about the document
    name = models.CharField(max_length=50, null=False, blank=False)
    description = models.TextField(null=False, blank=True)
    url = models.URLField()

    # Tags Equivalence
    is_introduction = models.BooleanField()
    eoc_generals = models.ManyToManyField(EOCGeneral)
    eoc_specifics = models.ManyToManyField(EOCSpecific)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
