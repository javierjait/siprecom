import { View, StyleSheet, Text } from "react-native";

// Styles
import { colors } from "../styles/colors";

const OfflineNotice = ({ offline }) => {
    if (offline)
        return (
            <View style={{ backgroundColor: colors.navBackground }}>
                <View style={styles.container}>
                    <Text style={{
                        textTransform: 'uppercase',
                        fontSize: 18,
                        fontWeight: 'boldr'
                    }}>Sin conexión</Text>
                </View>
            </View>
        )

    return null
}

const styles = StyleSheet.create({
    container: {        
        backgroundColor: colors.offlineBackground,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        margin: 5
    }
});

export default OfflineNotice;