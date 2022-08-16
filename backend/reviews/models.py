import uuid

# Create your models here.
from django.db import models

from course_evaluations.models import CourseEvaluation, DevelopmentLevels, EOCSpecific
from documents.models import Document


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
    review = models.ForeignKey(Review, null=True, related_name="eoc_specific_reviews", on_delete=models.CASCADE)
    eoc_specific = models.ForeignKey(EOCSpecific, on_delete=models.CASCADE)

    development_level = models.IntegerField(choices=DevelopmentLevels.choices)

    suggestion = models.TextField(null=False, blank=True)
    justification = models.TextField(null=False, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ReviewDocument(models.Model):
    """
    For each review, the reviewer may supply comments on different documents.
    ReviewDocument contains information regarding these comments.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(Review, related_name="documents", on_delete=models.CASCADE)
    document = models.ForeignKey(Document, related_name="review_messages", on_delete=models.CASCADE)
    is_viewed = models.BooleanField()
    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
