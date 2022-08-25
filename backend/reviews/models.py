import uuid

from django.db import models

from course_evaluations.models import (
    CourseEvaluation,
    DevelopmentLevels,
    Document,
    EOCSpecific,
)

"""
A review consist of 4 parts.
1. Viewed the EOC
2. Viewed a document
3. Added a review for a specific EOC
4. Submitted the review
"""


class Review(models.Model):
    """
    A review is what Reviewers make. There are many reviews per
    course evaluation, one per reviewer.

    Has fields representing **step 1** and **step 4**.
    """

    # UUID for the review
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # One-to-many Relationship with Course Evaluations
    course_evaluation = models.ForeignKey(CourseEvaluation, on_delete=models.CASCADE)

    reviewer = models.ForeignKey("auth.User", related_name="reviews", on_delete=models.CASCADE)

    # Step 4 Relevant Fields
    final_comment = models.TextField(null=False, blank=True)
    date_submitted = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # A particular reviewer and a course_evaluation can only exist as once
        unique_together = (("course_evaluation", "reviewer"),)

    def __str__(self):
        return f"Review ({self.id}) {self.course_evaluation.id} - {self.reviewer.username}"


class ReviewDocument(models.Model):
    """
    For each review, the reviewer may supply comments on different documents.
    ReviewDocument contains information regarding these comments.

    Represents review **step 2**
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(Review, related_name="documents", on_delete=models.CASCADE)
    document = models.ForeignKey(Document, related_name="review_messages", on_delete=models.CASCADE)

    # Step 2 Relevant Fields
    is_viewed = models.BooleanField()
    comment = models.TextField(null=False, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ReviewEocSpecific(models.Model):
    """
    For each eoc in a review, they each need specific infomration filled out.

    Represents review **step 3**
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(Review, null=True, related_name="eoc_specific_reviews", on_delete=models.CASCADE)
    eoc_specific = models.ForeignKey(EOCSpecific, on_delete=models.CASCADE)
    
    # Step 3 Relevant Fields
    development_level = models.IntegerField(choices=DevelopmentLevels.choices)
    suggestion = models.TextField(null=False, blank=True)
    justification = models.TextField(null=False, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


