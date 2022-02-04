import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Button } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import Tree from '../components/Tree';

const SingleTreeScreen = ({route, navigation}) => {    
    const {treeId} = route.params;

    const treeDetailsQuery = gql `
    query tree($treeId: UUID) {
      tree(treeId: $treeId) {
        edges {
          node {
            treeId
            latitude
            longitude
            birthday
            treephotoSet {
              edges {
                node {
                  photo
                  uploadedOn
                }
              }
            }
          }
        }
      }
    }
    `;

    const {loading, error, data} = useQuery(treeDetailsQuery,
      {variables: {treeId: treeId}});

    if (loading) {
      return <View><Text>Loading..</Text></View>
    }
    if (error) {
      return <View><Text>Error.. {JSON.stringify(error)}</Text></View>
    }
    return (
      <ScrollView>
        <Button title="Add new photo" onPress={() => {
           navigation.navigate('Add Photo', {treeId: treeId, treeObject: data.tree.edges[0].node})
        }}/>
        {
          data && data.tree && [data.tree.edges[0].node].map((tree) => (
          
          <View key={tree.treeId}>
            <Text>
              {tree.treeId}
            </Text>
            <Tree  tree={tree} latestPhotoOnly={false} />
          </View>
        ))}
        
      </ScrollView>
    )
}

export default SingleTreeScreen;