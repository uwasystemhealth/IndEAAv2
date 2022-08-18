# Generated by Django 3.2.13 on 2022-08-18 04:18

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('course_evaluations', '0002_courseevaluationjustification'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('reviews', '0002_auto_20220818_1039'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='review',
            unique_together={('course_evaluation', 'reviewer')},
        ),
    ]
