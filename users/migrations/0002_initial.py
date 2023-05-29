# Generated by Django 4.2 on 2023-05-25 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('name', models.CharField(default=None, max_length=35)),
                ('username', models.CharField(max_length=20, unique=True)),
                ('password', models.CharField(max_length=100)),
                ('email', models.EmailField(default=None, max_length=50)),
                ('created_time', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
