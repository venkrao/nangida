import React, {useState, useEffect} from 'react';
import { Text, View, Button, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native';
import { styles } from '../css/style';
import { gql, useMutation } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

import AddTreePhoto from './AddTreePhoto';
import Geolocation from '../components/Geolocation';

const AddTree = () => {  
    const [photoUri, setImage] = useState(null);
    const [formState, setFormState] = useState({
      latitude: null,
      longitude: null,
      treeId: null
    });
    
    const [jwtToken, setToken] = useState(null);
    const checkLoginState = async () => {
        // retrieve the value of the token
        const jwtToken = await SecureStore.getItemAsync('jwt_token');
        setToken(jwtToken);
    };

    useEffect(() => {
        checkLoginState();
    });

    const createTreeMutation = gql `
        mutation newTree($latitude: Float!, $longitude: Float!) {
            newTree(latitude: $latitude, longitude: $longitude) {
              tree {
                treeId
                birthday
              }    
            }
        }
    `
    
    const [onAddTreePress, { data, loading, error }] = useMutation(createTreeMutation, 
        {variables: {latitude: formState.latitude, longitude: formState.longitude},
        context: {
          headers: {"Authorization": `JWT ${jwtToken}`}
        }
      },
    );
    
    if (loading) {
        return <View><Text>Creating tree..</Text></View>;
    }
    if (error) {
        console.log(error.message);
        return <View><Text>{JSON.stringify(error)}</Text></View>;
    } 
    if (data) {
        console.log("Tree created");
        const treeId = data.newTree.tree.treeId;  
        return <AddTreePhoto photoUri={photoUri} treeId={treeId} jwtToken={jwtToken} />
    }

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });          
        if (!result.cancelled) {
          setImage(result.uri);
          setFormState({
            ...formState, treeId: result.uri
          })
        }
        if (result.cancelled) {
          console.log("action canceled");
        }
    };    
    
    
    return (
        <View>
          <Geolocation></Geolocation>     
          <TouchableOpacity
            onPress={pickImage}>
            <Text>
                Click here to pick a file
            </Text>            
          </TouchableOpacity>
          <Text>Latitude </Text>
          <TextInput autoCorrect={false}          
          style={styles.input}
          onChangeText={
            (latitude) => {
              setFormState({
                ...formState, latitude: latitude
              })
            }
          }
          />
          
          <Text>Longitude </Text>
          <TextInput autoCorrect={false}          
          style={styles.input}
          onChangeText={
            (longitude) => {
              setFormState(
                {...formState, longitude: longitude}
              )
            }
          }
          />

          <Button title='Upload' onPress={onAddTreePress}></Button>
        </View>
    );
}

export default AddTree;
