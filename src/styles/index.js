import { StyleSheet } from 'react-native';
import { colors } from './colors';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.mainBackground
    },
    containerLogin: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: 10
    },
    containerTags: {
        flex: 1,
        margin: 10        
    },    
    containerFormulario: {
        flex: 1,
        padding: 10        
    },    
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    error: {
        color: colors.errorText
    },
    buttonContainer: {
        borderRadius: 5, 
        paddingVertical: 10,       
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.buttonBackground,
        flexDirection: 'row'
    },
    buttonText: {
        color: colors.mainBackground
    },
    rowHeaderBase: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,        
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    rowHeaderText: {
        fontWeight: 'bold'
    },
    rowBase: {
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', 
        borderBottomWidth: 1,
        borderBottomColor: colors.border       
    },
    formBase: {
        flex: 1,
        marginBottom: 10
    },
    formTextInput: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 5
    },
    formError: {
        fontSize: 10,
        color: 'red'        
    },
    tituloStyle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    subTituloStyle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    listComponentWidthPortrait: {
        width: 150,
        paddingHorizontal: 5
    },
    listComponentWidthLandscape: {
        width: 200,
        paddingHorizontal: 5
    },
    marginTop10: {
        marginTop: 10
    }
});

export {
    styles
}