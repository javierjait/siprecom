import { Text, View } from "react-native"

// 3rd party components
import { useField } from "formik"

// Styles
import { styles } from "../../styles"

export const MyText = ({ label, type, ...props }) => {
    const [field] = useField(props)

    return (
        <View style={[styles.formBase, {
            ...type !== 'label' && { alignItems: 'center' }
        }]}>
            <Text
                style={type === 'titulo' ? styles.tituloStyle : type === 'subtitulo' ? styles.subTituloStyle : null}
            >{field.value || label}</Text>
        </View>
    )
}