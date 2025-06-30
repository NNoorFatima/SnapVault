import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 30,
        backgroundColor: '#1F1F51',
        borderRadius: 20,
        marginTop: '50%', // vertical center approx
        width: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: 'white',
    },
    label: {
        fontSize: 14,
        marginTop: 10,
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginTop: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        // gap:10,
    },
    updateButton: {
        backgroundColor: '#73DBE5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginRight: 10,
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginLeft: 10,
        backgroundColor: '#D7EDEF',
    },

});

export default styles;