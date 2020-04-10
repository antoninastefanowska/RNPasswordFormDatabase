import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      margin: 5,
      padding: 5
    },

    elementContainer: {
        margin: 3,
        padding: 5,
        backgroundColor: '#e3fffe'
    },

    horizontalContainer: {
        margin: 2,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },

    verticalContainer: {
        margin: 2,
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center'
    },

    smallLabel: {
        margin: 1,
        fontSize: 12,
        flex: 1,
        flexWrap: 'wrap'
    },

    smallLabelAlign: {
        margin: 2,
        fontSize: 12
    },

    radioButton: {
        margin: 1
    },

    label: {
        fontSize: 15,
        fontWeight: 'bold',
    },

    input: {
        padding: 3
    },

    error: {
        color: '#c53c3c',
        fontWeight: 'bold'
    }
  });