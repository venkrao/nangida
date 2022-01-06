import React, { Component } from 'react';
import {  
  ApolloProvider  
} from "@apollo/client";

import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StackNavigatorMain from './navigators/StackNavigatorMain';

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client';

const cache = new InMemoryCache()
const uri = `http://192.168.157.93:8080/graphql/`;

const client = new ApolloClient({
  link: createUploadLink({uri}),
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
});
const Stack = createNativeStackNavigator();

const NangidaApp = () => { 
    return (
      <ApolloProvider client={client}>
      <NavigationContainer>
        <StackNavigatorMain></StackNavigatorMain>
      </NavigationContainer>
      </ApolloProvider>
    );
}

export default NangidaApp;

