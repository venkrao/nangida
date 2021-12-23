import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
from graphene_django.filter import DjangoFilterConnectionField
import graphql_jwt

from api.trees.models import *


class TreeType(DjangoObjectType):
    class Meta:
        model = Tree
        filter_fields = ['tree_id']
        interfaces = (relay.Node, )


class TreePhotoType(DjangoObjectType):
    class Meta:
        model = TreePhoto
        filter_fields = {
            'tree_id__tree_id': ['exact']
        }
        interfaces = (relay.Node, )


class Query(graphene.ObjectType):
    all_trees = graphene.List(TreeType)
    tree = DjangoFilterConnectionField(TreeType)
    tree_photos = graphene.List(TreePhotoType)
    tree_photo = DjangoFilterConnectionField(TreePhotoType)

    def resolve_all_trees(self, root):
        return Tree.objects.all()

    def resolve_tree_photos(self, root):
        return TreePhoto.objects.all()


class NewTreeMutation(graphene.Mutation):
    class Arguments:
        latitude = graphene.Float()
        longitude = graphene.Float()

    tree = graphene.Field(TreeType)

    @classmethod
    def mutate(cls, root, info, latitude, longitude):
        user = User.objects.get(username=info.context.user)
        tree = Tree(latitude=latitude, longitude=longitude, owner=user)
        tree.save()

        return NewTreeMutation(tree=tree)


class UpdateTreePhoto(graphene.Mutation):
    class Arguments:
        tree_id = graphene.UUID()
        photo = Upload()

    photo = graphene.Field(TreePhotoType)

    @classmethod
    def mutate(cls, root, info, photo, tree_id):
        tree = Tree.objects.get(tree_id=tree_id)
        tree_photo = TreePhoto(tree_id=tree, photo=photo)
        tree_photo.save()
        print(tree_photo)

        return UpdateTreePhoto(tree_photo)


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    new_tree = NewTreeMutation.Field()
    update_photo = UpdateTreePhoto.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)