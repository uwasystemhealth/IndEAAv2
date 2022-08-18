# Generated by Django 3.2.13 on 2022-08-18 03:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("course_evaluations", "0002_courseevaluationjustification"),
        ("documents", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="document",
            name="course_evaluation",
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="documents", to="course_evaluations.courseevaluation"),
        ),
        migrations.AlterField(
            model_name="document",
            name="eoc_generals",
            field=models.ManyToManyField(blank=True, to="course_evaluations.EOCGeneral"),
        ),
        migrations.AlterField(
            model_name="document",
            name="eoc_specifics",
            field=models.ManyToManyField(blank=True, to="course_evaluations.EOCSpecific"),
        ),
    ]
