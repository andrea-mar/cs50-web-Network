# Generated by Django 3.1.3 on 2021-02-19 10:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_auto_20210219_0901'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='user',
            new_name='user_id',
        ),
    ]