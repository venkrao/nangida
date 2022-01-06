import { StyleSheet } from 'react-native';

export const PINK = '#ff5dc8'

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 16,
      alignItems: 'center'
    },
    title: {
      textAlign: 'center',
      marginVertical: 8,
    },
    button: {   
      backgroundColor: "#DDDDDD",
      padding: 4
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderBottomColor: '#000000',
    },
});


export {styles};