# Generated by Django 3.2.13 on 2022-08-18 02:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='date_submitted',
            field=models.DateTimeField(null=True),
        ),
    ]
