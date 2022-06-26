# Generated by Django 3.2.13 on 2022-06-26 18:19

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EOCSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='EOCGeneral',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField()),
                ('title', models.CharField(max_length=100)),
                ('eoc_set', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_evaluations.eocset')),
            ],
            options={
                'unique_together': {('number', 'eoc_set')},
            },
        ),
        migrations.CreateModel(
            name='CourseEvaluation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('unit_code', models.CharField(blank=True, max_length=20)),
                ('description', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('coordinators', models.ManyToManyField(related_name='course_evaluation_coordinator', to=settings.AUTH_USER_MODEL)),
                ('eoc_set', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_evaluations.eocset')),
            ],
        ),
        migrations.CreateModel(
            name='EOCSpecific',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField()),
                ('indicators_of_attainment', django.contrib.postgres.fields.ArrayField(base_field=models.TextField(blank=True), null=True, size=None)),
                ('description', models.TextField(blank=True)),
                ('eoc_general', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='course_evaluations.eocgeneral')),
            ],
            options={
                'unique_together': {('number', 'eoc_general')},
            },
        ),
    ]
