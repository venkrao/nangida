from rest_framework.status import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import *


# Create your views here.
class TreeEndpoint(APIView):
    authentication_classes = (JWTTokenUserAuthentication, )
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        trees = Tree.objects.all()
        serializer = TreeSerializer(trees, many=True)
        return Response(serializer.data)

    def post(self, request):
        tree = request.data
        tree["owner"] = User.objects.get(username=request.user).id

        serializer = TreeSerializer(data=tree)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        else:
            return Response(serializer.errors)

    def delete(self, request):
        data = request.data
        owner = User.objects.get(username=request.user).id
        tree = Tree.objects.get(tree_id=data.get("tree_id", None), owner=owner)

        if tree:
            tree.delete()
            return Response(data, status=HTTP_200_OK)
        else:
            return Response({"errors": "No such tree exists, or you're not authorized to delete this tree"},
                            status=HTTP_200_OK)


class TreePhotosAllEndpoint(APIView):
    authentication_classes = (JWTTokenUserAuthentication,)
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        photos = TreePhoto.objects.all()
        serializer = TreePhotoSerializer(photos, many=True)
        return Response(serializer.data, status=HTTP_200_OK)


class TreePhotoEndpoint(APIView):
    authentication_classes = (JWTTokenUserAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, tree_id):
        photo = TreePhoto.objects.get(tree_id=tree_id)
        serializer = TreePhotoSerializer(photo)
        return Response(serializer.data, status=HTTP_200_OK)

