import { Pressable, Text } from "react-native"
import { styles } from "../styles";

// Styles
import { colors } from '../styles/colors';

const TextButton = ({
    marginTop = 0,
    rippleColor = 'gray',
    backgroundColor = colors.buttonBackground,
    color = 'white',
    title,
    onPress,
    onTouchStart }) => {
    return (
        <Pressable
            style={[styles.buttonContainer, {
                marginTop,
                backgroundColor
            }]
            }
            android_ripple={{ color: rippleColor }}
            onTouchStart={() => onTouchStart && onTouchStart()}
            onPress={() => onPress && onPress()}
        >
            <Text style={{
                color
            }}>{title}</Text>
        </Pressable>)
}

export {
    TextButton
}