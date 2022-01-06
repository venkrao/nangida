import * as React from 'react';

import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native';

const Logout = () => {
    const onLogout = () => {
        console.log("Deleting jwt_token");
        SecureStore.deleteItemAsync('jwt_token');

    };

    return (
        <SafeAreaView>
            <Button
            title={'Logout'}
            onPress={onLogout}
            />
        </SafeAreaView>
    )
}

export default Logout;