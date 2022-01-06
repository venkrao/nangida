import React, {useState, useEffect} from 'react';

import {View, Text, Image, TouchableOpacity} from 'react-native'
import Login from '../components/Login';
import AddTree from '../components/AddTree';
import * as SecureStore from 'expo-secure-store';

const AddTreeScreen = ({navigation}) => {
    const [jwtToken, setToken] = useState(null);    
    const checkLoginState = async () => {
        // retrieve the value of the token
        const jwtToken = await SecureStore.getItemAsync('jwt_token');
        setToken(jwtToken);
    };

    useEffect(() => {
        checkLoginState();
    });

    return (
        <View>
            <Text>
                Have you already planted a tree? Great! 🙌 Upload a picture here.
            </Text>
            { !jwtToken &&<Login />}
            { jwtToken && <AddTree/> }   
        </View>
    )
}

export default AddTreeScreen;