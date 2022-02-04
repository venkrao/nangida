import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {useEffect} from 'react';

import Tree from '../components/Tree';
import { styles } from '../css/style';

import { useQuery, gql } from '@apollo/client';

const treeQuery = gql `
{
    allTrees {
      treeId
      latitude
      longitude
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
`;


const TreeListScreen = ({navigation}) => {
    const {loading, error, data, refetch} = useQuery(treeQuery);    
    
    useEffect(() => {
      refetch()
      
    }, []);

    if (loading) {
      return <View><Text>Loading..</Text></View>
    }
    if (error) {      
      return <View><Text>{JSON.stringify(error)}</Text></View>
    }

    return (
      <ScrollView>        
        {data && data.allTrees && data.allTrees.map((tree) => (
          <View key={tree.treeId} >
            <Text 
                style={styles.button}
                onPress={() => {
                    navigation.navigate("Tree", {treeId: tree.treeId})
                }}
            >
              {tree.treeId}
            </Text>
            
            <Tree tree={tree} latestPhotoOnly={true} />
            </View>
        ))}
      </ScrollView>
    )
}

export default TreeListScreen;