import React, {useState, useEffect} from 'react';
import { Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { gql, useMutation } from '@apollo/client';

import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';

import TreeListScreen from '../screens/TreeListScreen';
function generateRNFile(uri, name) {
    return uri ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || 'image',
        name,
    }): null
}

const AddTreePhoto = (props) => {
    const {photoUri, treeId, jwtToken} =  props;
    const file = generateRNFile(photoUri, photoUri.split("/").reverse()[0]);

    const addTreePhotosMutation = gql `
        mutation updatePhoto($photo: Upload, $treeId: UUID) {
            updatePhoto(photo: $photo, treeId: $treeId) {
              photo {
                photo
                uploadedOn
              }
            }
          }
    `
    useEffect(() => {
        onAddTreePhotoPress();      
    }, []);


    const [onAddTreePhotoPress, { data, loading, error }] = useMutation(addTreePhotosMutation, 
        {variables: {photo: file, treeId: treeId},
        context: {
            headers: {"Authorization": `JWT ${jwtToken}`}
        }
      },
    );
    
    if (loading) {
        return <View><Text>Creating tree..</Text></View>;
    }
    if (error) {
        return <View><Text>{JSON.stringify(error)}</Text></View>;
    } 
    if (data) {
        console.log("tree photo uploaded");
        return <TreeListScreen></TreeListScreen>
    }
    return (
        <View>
            <Text>Upload photo</Text>
        </View>
    );
}

export default AddTreePhoto;