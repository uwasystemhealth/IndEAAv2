# Generated by Django 3.2.15 on 2022-10-30 01:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("course_evaluations", "0004_auto_20220906_1818"),
    ]

    operations = [
        migrations.AlterField(
            model_name="courseevaluationjustification",
            name="development_level",
            field=models.IntegerField(
                choices=[(1, "Engineering Fundamentals"), (2, "Engineering Applications And Analysis"), (3, "Engineering Practice")]
            ),
        ),
    ]