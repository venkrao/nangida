import * as React from 'react';
import {useState} from 'react';

import { TextInput, Text, View, Button} from 'react-native';

import { useMutation, gql } from '@apollo/client';
import { setValueFor} from '../utils';


const Login = () => {
    const loginQuery = gql `
    mutation tokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
        }
        }
    `
    const [formState, setFormState] = useState({
        username: null,
        password: null
    })

    const [onLogin, { loading, error, data }] = useMutation(loginQuery, 
        {variables: {username: formState.username, password: formState.password}        
        },        
        );
    
    if (loading && !error) {
        return <View><Text>loading..</Text></View>;
    } else if (error) {        
        return <View><Text>{error.message}</Text></View>;
    } else if (data) {
        setValueFor('jwt_token', data.tokenAuth.token);
        console.log("Login successful.");
    }
        
    return (
        <View>
            <TextInput               
                onChangeText={(username) => {
                    setFormState({
                        ...formState, username: username
                    })
                }}
            />
            <TextInput
            secureTextEntry={true}            
                onChangeText={(password) => {
                    setFormState({
                        ...formState, password: password
                    })
                }}
            />
            <Button
            title={'Login'}            
            onPress={onLogin}
            />
            {error && error.message && <Text>{error.message}</Text>}
        </View>  
    )
}

export default Login;