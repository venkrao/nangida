from .models import *
from rest_framework.serializers import ModelSerializer


class TreeSerializer(ModelSerializer):
    class Meta:
        model = Tree
        fields = "__all__"


class TreePhotoSerializer(ModelSerializer):
    class Meta:
        model = TreePhoto
        fields = "__all__"
