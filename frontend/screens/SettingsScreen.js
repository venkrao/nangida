import * as React from 'react'
import {View, Button} from 'react-native'

const SettingsScreen = ({navigation}) => {
    return (
        <View>
          <View>
            <Button title="Logout" onPress={() => {navigation.navigate('Logout')}}/>            
        </View>
        </View>
    )
}

export default SettingsScreen;