import { Text, TextInput, View } from "react-native"

// 3rd party components
import { useField } from "formik"

// Styles
import { styles } from "../../styles"

export const MyTextInput = ({ label, style = styles.formBase, ...props }) => {
    const [field, meta] = useField(props)

    return (
        <View style={style}>
            {label && <Text>{label}</Text>}
            <TextInput
                name={field.name}
                value={field.value}
                {...props}
                style={styles.formTextInput}
                keyboardType={props.type === "email" ? "email-address" : "default"}
                secureTextEntry={props.type === "password"}
            />
            {meta.error &&
                <Text style={styles.formError}>{meta.error}</Text>}
        </View>
    )
}