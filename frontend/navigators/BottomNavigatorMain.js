import * as React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import TreesScreen from '../screens/TreesScreen'
import SettingsScreen from '../screens/SettingsScreen'
import CameraScreen from '../screens/CameraScreen'


const Tab = createBottomTabNavigator();

const BottomTabNavigatorMain = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Trees" component={TreesScreen} />             
            <Tab.Screen name="Camera" component={CameraScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            
        </Tab.Navigator>
    )
}

export default BottomTabNavigatorMain;