import uuid

# Create your models here.
from django.db import models
from course_evaluations.models import CourseEvaluation, EOCSpecific


class Review(models.Model):
    """
    A review is what Reviewers make. There are many reviews per
    course evaluation, one per reviewer.
    """

    # UUID for the review
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # One-to-many Relationship with Course Evaluations
    course_evaluation = models.ForeignKey(CourseEvaluation, on_delete=models.CASCADE)

    coordinators = models.ForeignKey("auth.User", related_name="reviews", on_delete=models.CASCADE)

    final_comment = models.TextField(null=False, blank=True)

    date_submitted = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ReviewEocSpecific(models.Model):
    """
    For each eoc in a review, they each need specific infomration filled out.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    eoc_specific = models.ForeignKey(EOCSpecific, on_delete=models.CASCADE)

    development_level = models.IntegerChoices("DevelopmentLevel", "1 2 3 4 5")

    suggestion = models.TextField(null=False, blank=True)
    justification = models.TextField(null=False, blank=True)
