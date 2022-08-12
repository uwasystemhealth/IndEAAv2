import uuid
from django.db import models

from course_evaluations.models import EOCGeneral, EOCSpecific


class Documents(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=127)
    description = models.TextField()
    link = models.URLField()
    isInIntroduction = models.BooleanField(default=False)

    eocGeneral = models.ForeignKey(EOCGeneral, on_delete=models.CASCADE)
    eocSpecific = models.ForeignKey(EOCSpecific, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.name} - {self.link}"
