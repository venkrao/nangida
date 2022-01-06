import React, {useState, useEffect} from 'react';

import {View, Text, Button, TouchableOpacity} from 'react-native'
import * as SecureStore from 'expo-secure-store';
import { gql, useMutation } from '@apollo/client';
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';


function generateRNFile(uri, name) {
    return uri ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || 'image',
        name,
    }): null
}

const AddPhotoForExistingTreeScreen = ({route, navigation}) => {
    const { treeId, treeObject } = route.params;
    
    console.log(treeObject);

    const [jwtToken, setToken] = useState(null);
    const [fileUri, setFileUri] = useState(null);

    const checkLoginState = async () => {
        const jwtToken = await SecureStore.getItemAsync('jwt_token');
        setToken(jwtToken);
        console.log(jwtToken);
    };

    useEffect( () => {
        checkLoginState();
    }, []);

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

    var file = undefined;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const photoUri = result.uri;
            file = generateRNFile(photoUri, photoUri.split("/").reverse()[0]);
            setFileUri(file);
        };

        if (result.cancelled) {
            console.log("action canceled");
        };
    };

    console.log(fileUri);
    const [onAddTreePhotoPress, {data, loading, error}] = useMutation(addTreePhotosMutation, 
        {
            variables: {photo: fileUri, treeId: treeId},
            context: {
                headers: {"Authorization": `JWT ${jwtToken}`}
            }
        })
    
    if (loading) {
        return <View><Text>Upload in progress..</Text></View>
    }
    
    if (error) {
        return <View><Text>Error uploading.. {JSON.stringify(error)}</Text></View>
    }

    if (data) {
        return <View><Text>Upload successful.. {JSON.stringify(data)}</Text></View>
    }

    return (
        <View>
            <Text>Add photo for tree {treeId}</Text>
            <TouchableOpacity onPress={pickImage}>
                <Text>Press here to select a tree photo</Text>
            </TouchableOpacity>
            <Button title="Upload" onPress={onAddTreePhotoPress}>
            </Button>
        </View>
    )
}
    
export default AddPhotoForExistingTreeScreen;