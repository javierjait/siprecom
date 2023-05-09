import { View, Text } from "react-native"

// Helpers
import { isNumeric } from "../helpers"

// Styles
import { colors } from "../styles/colors"

const Avance = ({
    height = 30,
    width = 100,
    backgroundColor = colors.progressBackground,
    avance,
    avanceTextColor = 'white',
    style }) => {

    return (
        <View style={{
            height,
            width,
            backgroundColor,
            borderRadius: 5,
            overflow: 'hidden',
            ...style
        }}>
            {isNumeric(avance) && <View style={{
                backgroundColor: avance < 50 ? colors.danger : avance < 100 ? colors.warning : colors.success,
                height: '100%',
                width: `${avance}%`,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    color: avanceTextColor,
                    ...avance < 50 && { fontSize: 10 }
                }}>{`${avance}%`}</Text>
            </View>}
        </View>
    )
}

export default Avance