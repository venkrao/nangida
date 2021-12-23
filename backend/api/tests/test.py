import json

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from graphene_django.utils.testing import GraphQLTestCase
from graphene_file_upload.django.testing import  GraphQLFileUploadTestCase
from rest_framework import status
from api.trees.schema import schema


class GraphTests(GraphQLFileUploadTestCase, GraphQLTestCase):
    GRAPHQL_SCHEMA = schema

    def setUp(self):
        pass

    def get_create_user(self):
        User = get_user_model()
        self.username = 'testuser'
        self.password = 'password'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password
        )

    def get_token(self):
        self.get_create_user()
        query = """
            mutation {
                tokenAuth(username: "testuser", password: "password") {
                    token
                }
                }
            """
        jwt_token = self.query(query, variables={})
        token = json.loads(jwt_token.content)["data"]["tokenAuth"]["token"]
        return token

    def test_resolve_all_trees_inaccessible_for_unauthenticated_users(self):
        token = self.get_token()
        tree = self.query('''
                        mutation {
                        newTree(latitude: 10.33333, longitude: 293.333) {
                        tree {
                            treeId
                        }
                        }
                        }''', headers={'HTTP_AUTHORIZATION': f'JWT {token}'})

        tree_id = json.loads(tree.content)["data"]["newTree"]["tree"]["treeId"]
        self.assertEqual(type(tree_id) == str, True)

        headers = {"HTTP_AUTHORIZATION": "JWT {}".format(token)}

        response = self.query('''
        query {
          treePhotos {
            photo
          }
        }''', headers=headers)
        expected_response_text = b'{"data":{"treePhotos":[]}}'

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, expected_response_text)

    def test_tree_photo_upload_should_save_file(self):
        token = self.get_token()
        headers = {"HTTP_AUTHORIZATION": "JWT {}".format(token)}
        tree = self.query('''
        mutation {
        newTree(latitude: 10.33343, longitude: 293.33333) {
        tree {
            treeId
        }
        }
        }''', headers=headers)

        tree_id = json.loads(tree.content)["data"]["newTree"]["tree"]["treeId"]
        self.assertEqual(type(tree_id) == str, True)

        file_text = "blah blah blah...."
        test_file = SimpleUploadedFile(name='test.txt', content=file_text.encode('utf-8'))
        print(test_file)
        tree_photo = self.file_query("""mutation updatePhoto($photo: Upload, $tree_id: UUID) {
                updatePhoto(photo: $photo, treeId: $tree_id) {
                    photo {
                        photo,
                        uploadedOn
                    }
                }
            }""", headers=headers,
            variables={'tree_id': tree_id},
            op_name="updatePhoto",
            files={'photo': test_file}
        )
        self.assertResponseNoErrors(tree_photo)

