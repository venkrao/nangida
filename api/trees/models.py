import uuid

from django.db import models
from django.contrib.auth.models import User
from api.trees.utils import *


# Create your models here.
class NangidaUser(User):
    anonymous = models.BooleanField(default=False)


class Tree(models.Model):
    tree_id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    birthday = models.DateTimeField(auto_now=True)


class TreePhoto(models.Model):
    tree_id = models.ForeignKey(Tree, on_delete=models.CASCADE)
    photo = models.FileField(upload_to=tree_upload_handler)
    uploaded_on = models.DateTimeField(auto_now=True)
