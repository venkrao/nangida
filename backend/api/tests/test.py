import json
import sys

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from graphene_django.utils.testing import GraphQLTestCase
from graphene_file_upload.django.testing import  GraphQLFileUploadTestCase
from rest_framework import status
from api.trees.schema import schema


class GraphTests(GraphQLFileUploadTestCase, GraphQLTestCase):
    GRAPHQL_SCHEMA = schema

    def setUp(self):
        token = self.get_token()
        self.token = token

    def get_create_user(self, username="testuser", password="password"):
        User = get_user_model()
        self.user = User.objects.create_user(
            username=username,
            password=password
        )

    def get_token(self, create_user=True, username="testuser", password="password"):
        if create_user:
            self.get_create_user(username, password)

        query = """mutation tokenAuth($username: String!, $password: String!) {
                tokenAuth(username: $username, password: $password) {
                    token
                }
                }
            """
        jwt_token = self.query(query,
                               variables={"username": username, "password": password},
                               op_name="tokenAuth")
        token = json.loads(jwt_token.content)["data"]["tokenAuth"]["token"]
        return token

    def test_resolve_all_trees_inaccessible_for_unauthenticated_users(self):
        tree = self.query('''
                        mutation {
                        newTree(latitude: 10.33333, longitude: 293.333) {
                        tree {
                            treeId
                        }
                        }
                        }''', headers={'HTTP_AUTHORIZATION': f'JWT {self.token}'})

        tree_id = json.loads(tree.content)["data"]["newTree"]["tree"]["treeId"]
        self.assertEqual(type(tree_id) == str, True)
        headers = {"HTTP_AUTHORIZATION": "JWT {}".format(self.token)}
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
        tree = self.insert_tree()
        tree_id = json.loads(tree.content)["data"]["newTree"]["tree"]["treeId"]
        self.assertEqual(type(tree_id) == str, True)

        file_text = "blah blah blah...."
        test_file = SimpleUploadedFile(name='test.txt', content=file_text.encode('utf-8'))

        headers = {"HTTP_AUTHORIZATION": "JWT {}".format(self.token)}

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

    def test_delete_tree_should_fail_without_auth_headers(self):
        headers = {}
        tree = self.insert_tree()
        tree_id = json.loads(tree.content)["data"]["newTree"]["tree"]["treeId"]

        delete_tree = self.query("""mutation deleteTree($tree_id: UUID) {
                        deleteTree(treeId: $tree_id) {
                            deleteOk   
                            }
                    }""", headers=headers,
                                     variables={'tree_id': tree_id},
                                     op_name="deleteTree"
                                     )
        error = json.loads(delete_tree.content)["errors"][0]["message"]

        self.assertResponseHasErrors(delete_tree)
        self.assertEqual(error, "You do not have permission to perform this action")

    def test_delete_tree_should_fail_if_user_donot_owns_the_tree(self):
        new_token = self.get_token(username="anotheruser", password="password")
        headers = {"HTTP_AUTHORIZATION": "JWT {}".format(new_token)}
        tree = self.insert_tree()
        tree_id = json.loads(tree.content)["data"]["newTree"]["tree"]["treeId"]

        delete_tree = self.query("""mutation deleteTree($tree_id: UUID) {
                        deleteTree(treeId: $tree_id) {
                            deleteOk   
                            }
                    }""", headers=headers,
                                     variables={'tree_id': tree_id},
                                     op_name="deleteTree"
                                     )
        error = json.loads(delete_tree.content)["errors"][0]["message"]

        self.assertResponseHasErrors(delete_tree)
        self.assertEqual(error, "Tree matching query does not exist.")


    def test_delete_tree_should_delete_tree_and_all_photos(self):
        headers = {"HTTP_AUTHORIZATION": "JWT {}".format(self.token)}

        tree = self.insert_tree()
        tree_id = json.loads(tree.content)["data"]["newTree"]["tree"]["treeId"]

        delete_tree = self.query("""mutation deleteTree($tree_id: UUID) {
                        deleteTree(treeId: $tree_id) {
                            deleteOk   
                            }
                    }""", headers=headers,
                                     variables={'tree_id': tree_id},
                                     op_name="deleteTree"
                                     )
        delete_ok = json.loads(delete_tree.content)["data"]["deleteTree"]["deleteOk"]
        self.assertResponseNoErrors(delete_tree)
        self.assertEqual(delete_ok, True)

    def insert_tree(self):
        headers = {"HTTP_AUTHORIZATION": "JWT {}".format(self.token)}
        tree = self.query('''
                mutation {
                newTree(latitude: 10.33343, longitude: 293.33333) {
                tree {
                    treeId
                }
                }
                }''', headers=headers)
        return tree

