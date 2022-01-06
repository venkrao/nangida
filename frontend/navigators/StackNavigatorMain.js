import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigatorMain from './BottomNavigatorMain';
import AddTreeScreen from '../screens/AddTreeScreen';
import LoginScreen from '../screens/LoginScreen';
import LogoutScreen from '../screens/LogoutScreen';
import SingleTreeScreen from '../screens/SingleTreeScreen';
import TreeListScreen from '../screens/TreeListScreen';
import AddPhotoScreen from '../screens/AddPhotoForExistingTreeScreen';

const Stack = createNativeStackNavigator();

const StackNavigatorMain = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={BottomTabNavigatorMain} options={{ headerShown: false }}/>
            <Stack.Screen name="Add Tree" component={AddTreeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Logout" component={LogoutScreen} />
            <Stack.Screen name="Trees" component={TreeListScreen} />
            <Stack.Screen name="Tree" component={SingleTreeScreen} />
            <Stack.Screen name="Add Photo" component={AddPhotoScreen} />
        </Stack.Navigator>
    )
}

export default StackNavigatorMain;

