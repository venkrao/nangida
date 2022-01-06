import React, {useEffect, useState} from "react";
import {View, Text} from 'react-native';
import * as Location from 'expo-location';

const Geolocation = () => {
    const [location, setLocation] = useState(undefined);
    const [error, setErrorMsg] = useState(undefined);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            console.log(status);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location is denied');
                return;
            }
        })();
    }, []);

    Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
        timeout: 5000
      })
      .then(res => setLocation(res))
      .catch(e => console.log(e));

    let text = 'Waiting..';
    if (error) {
        text = error;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View>
            <Text>{text}</Text>
        </View>
    )
}

export default Geolocation;