# Generated by Django 3.2.13 on 2022-08-18 06:53

import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("course_evaluations", "0003_document"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Review",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("final_comment", models.TextField(blank=True)),
                ("date_submitted", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("course_evaluation", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="course_evaluations.courseevaluation")),
                ("reviewer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="reviews", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "unique_together": {("course_evaluation", "reviewer")},
            },
        ),
        migrations.CreateModel(
            name="ReviewEocSpecific",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                (
                    "development_level",
                    models.IntegerField(choices=[(1, "Foundational"), (2, "Broad And Coherent"), (3, "Advanced"), (4, "Specialist")]),
                ),
                ("suggestion", models.TextField(blank=True)),
                ("justification", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("eoc_specific", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="course_evaluations.eocspecific")),
                (
                    "review",
                    models.ForeignKey(
                        null=True, on_delete=django.db.models.deletion.CASCADE, related_name="eoc_specific_reviews", to="reviews.review"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ReviewDocument",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("is_viewed", models.BooleanField()),
                ("comment", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "document",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="review_messages", to="course_evaluations.document"),
                ),
                ("review", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="documents", to="reviews.review")),
            ],
        ),
    ]