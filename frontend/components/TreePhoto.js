import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image } from 'react-native';

const style = StyleSheet.create({
    logo: {
        width: 500,
        height: 500
    }
});

const TreePhoto = (props) => {    
    const uri = `http://192.168.157.93:8080/media/tree-photos/${props.props.photo}`     
    return (
        <ScrollView>
            <Text>
            Uploaded on: {props.props.uploadedOn}
            </Text>
            <Image
                style={style.logo}
                source={{
                    uri: uri,
                }}           
            />
        </ScrollView>
    )
}
export default TreePhoto;
