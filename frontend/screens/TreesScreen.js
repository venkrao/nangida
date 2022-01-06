import * as React from 'react'
import { Text, View, Button } from 'react-native';
import TreeListScreen from './TreeListScreen';


const TreesScreen = ({navigation}) => {
    return (        
        <View>
            <Button title="Add Tree" onPress={() => {navigation.navigate('Add Tree')}}/>
            <TreeListScreen navigation={navigation}/>
        </View>
      );
}

export default TreesScreen;