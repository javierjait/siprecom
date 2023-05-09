import { Text, TextInput, View } from "react-native"

// 3rd party components
import { useField } from "formik"

// Styles
import { styles } from "../../styles"

export const MyTextArea = ({ label, ...props }) => {
    const [field, meta] = useField(props)

    return (
        <View style={styles.formBase}>
            {label && <Text>{label}</Text>}
            <TextInput
                name={field.name}
                value={field.value}
                {...props}
                multiline={true}
                numberOfLines={3}
                style={[styles.formTextInput, {
                    textAlignVertical: 'top'
                }]} />
            {meta.error &&
                <Text style={styles.formError}>{meta.error}</Text>}
        </View>
    )
}