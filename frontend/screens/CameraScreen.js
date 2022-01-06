import * as React from 'react'
import {View, Text} from 'react-native'

const CameraScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                Take a picture of the tree you just planted to upload it.
            </Text>
        </View>
    )
}

export default CameraScreen;