import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

// 3rd party components
import { useField } from 'formik'

// Helpers
import { convertToDate, formatDate } from '../../helpers'

// Styles
import { styles } from "../../styles"
import { colors } from '../../styles/colors'

export const MyDatePicker = ({ label, style = styles.formBase, ...props }) => {
    // State    
    const [show, setShow] = useState(false);
    const [field, meta] = useField(props)
    const { disabled, placeholder, onValueChange } = props

    const handlerChange = event => {
        setShow(false)
        if (event.type === 'set') {
            onValueChange(event.nativeEvent.timestamp)
        }
    }

    return (
        <View style={style}>
            {label && <Text>{label}</Text>}
            <TouchableOpacity
                disabled={disabled}
                onPress={() => !disabled && setShow(true)}
                style={[styles.formTextInput,
                { paddingVertical: 10 }]}>
                <Text style={{
                    color: field.value ? 'black' : colors.placeholder
                }}>{field.value ? formatDate(convertToDate(field.value)) : placeholder}</Text>
            </TouchableOpacity>
            {show && <DateTimePicker
                mode='date'
                locale="es-ES"
                value={field.value && convertToDate(field.value) || new Date()}
                onChange={handlerChange}
            />}
            {meta.error &&
                <Text style={styles.formError}>{meta.error}</Text>}
        </View>
    )
}