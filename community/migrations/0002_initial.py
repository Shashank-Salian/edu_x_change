# Generated by Django 4.2 on 2023-05-13 14:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0002_initial'),
        ('community', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('topic', models.CharField(default=None, max_length=25)),
                ('description', models.CharField(default=None, max_length=500)),
                ('icon_path', models.ImageField(default=None, null=True, upload_to='')),
                ('admin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='admin_of', to='users.users')),
                ('participants', models.ManyToManyField(related_name='communities_joined', to='users.users')),
            ],
        ),
    ]