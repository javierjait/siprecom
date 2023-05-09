import { Button, Text, View, StyleSheet } from "react-native"
import Modal from "react-native-modal"

const SyncModal = ({ visible, event }) => {
    return (
        <Modal
            animationType="slide"
            isVisible={visible}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            onBackdropPress={event}
        >
            <View
                style={styles.modalContainer}>
                <Text>¿Qué operación desea realizar con los datos ha sincronizar?</Text>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonView}>
                        <Button title="Sincronizar" onPress={() => event && event('sync')} />
                    </View>
                    <View style={styles.buttonView}>
                        <Button title="Eliminar" color='red' onPress={() => event && event('delete')} />
                    </View>
                    <View style={styles.buttonView}>
                        <Button title="Cancelar" onPress={event} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        margin: 20,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 20
    },
    buttonView: {
        margin: 10        
    }

})

export {
    SyncModal
}