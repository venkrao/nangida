import React from 'react';
import { Text, View, Button } from 'react-native';
import TreePhoto from './TreePhoto';

const Tree = (props) => {    
    const {tree, latestPhotoOnly} = props
    
    var treephotoSet = []
    if (tree && tree.treephotoSet) {
        if (latestPhotoOnly) {            
            treephotoSet.edges = [tree.treephotoSet.edges[0]]
        } else {
            treephotoSet = tree.treephotoSet
        }
    }
    return (
        <View>            
            <Text>
                Latitude: {tree.latitude}
                Longitude: {tree.longitude}
            </Text>
            {treephotoSet && treephotoSet.edges.map((edge) => (          
                <TreePhoto key={tree.treeId} props={edge.node} key={edge.node.photo} />
                )
            )}
        </View>
    )
}

export default Tree;