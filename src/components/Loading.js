import { ActivityIndicator, View } from "react-native"
import { colors } from "../styles/colors"

const Loading = () => {
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.modalBackground,
            zIndex: 1
        }}>
            <ActivityIndicator size='large' style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
        </View>
    )
}

export default Loading