import { Text, View } from "react-native"
import { Picker } from "@react-native-picker/picker"

// 3rd party components
import { useField } from "formik"

// Styles
import { styles } from "../../styles"

export const MySelect = ({ label, style = styles.formBase, ...props }) => {
    const [field, meta] = useField(props)
    const { options, enabled } = props

    return (
        <View style={[style]}>
            {label && <Text>{label}</Text>}
            <View style={{
                borderWidth: 1,
                borderRadius: 5,                
            }}>
                <Picker
                    enabled={enabled}
                    name={field.name}
                    selectedValue={field.value}
                    onValueChange={props.onValueChange}                    
                >
                    <Picker.Item label='Seleccionar una opción' value='' />
                    {options?.map(({ id, label }) => <Picker.Item key={id} label={label} value={id} />)}
                </Picker>
            </View>

            {meta.error &&
                <Text style={styles.formError}>{meta.error}</Text>}
        </View>
    )
}