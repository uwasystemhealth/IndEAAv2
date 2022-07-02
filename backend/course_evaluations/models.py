import uuid

# Create your models here.
from django.contrib.postgres.fields import ArrayField
from django.db import models


class EOCSet(models.Model):
    """
    EOCSet is a group of EOCs (Elements of Competencies)
    """

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class EOCGeneral(models.Model):
    """
    EOC General is an Element of Competency of a General Bracket.
    Note: If eoc = 2.1, then eoc_general = 2.
    """

    class Meta:
        # Enforcement of uniqueness for EOC General from the EOC Set
        unique_together = (("number", "eoc_set"),)

    number = models.IntegerField()
    title = models.CharField(max_length=100)
    eoc_set = models.ForeignKey(EOCSet, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.eoc_set.name} - {self.number} ({self.title})"


class EOCSpecific(models.Model):
    """
    EOC Specific is an Element of Competency of a Specific Bracket.
    Note: If eoc = 2.1, then eoc_specific = 1.
    """

    class Meta:
        # Enforcement of uniqueness for EOC Specific from the EOC General
        unique_together = (("number", "eoc_general"),)

    number = models.IntegerField()
    indicators_of_attainment = ArrayField(models.TextField(null=False, blank=True), null=True)
    description = models.TextField(null=False, blank=True)
    eoc_general = models.ForeignKey(EOCGeneral, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.eoc_general.eoc_set.name} - {self.get_general_and_specific_eoc()}"

    def get_general_and_specific_eoc(self):
        return f"{self.eoc_general.number}.{self.number}"


class CourseEvaluation(models.Model):
    """
    A course evaluation is a collection of information about the evaluation of a course.
    """

    # UUID for the evaluation
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Giving this char field a flexibility
    # Eg. CITS3403/CITS5505 (This is around 8+8+1 = 17 characters)
    unit_code = models.CharField(max_length=20, null=False, blank=True)
    description = models.TextField(null=False, blank=True)

    # Many-to-many Relationship with the Django User model
    # related_name: Allows to reference `CourseEvaluation` from User model
    coordinators = models.ManyToManyField("auth.User", related_name="course_evaluation_coordinator")

    eoc_set = models.ForeignKey(EOCSet, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.eoc_set.name} - {self.unit_code} ({self.created_at})"
