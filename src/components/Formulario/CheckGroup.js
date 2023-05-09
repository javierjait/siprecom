import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { RadioGroup } from "react-native-radio-buttons-group"

// 3rd party components
import { useField } from "formik"

// Styles
import { styles } from "../../styles"

export const MyCheckGroup = ({ label, onValueChange, ...props }) => {
    const [field, meta] = useField(props)
    
    const [radioButtons, setRadioButtons] = useState([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'OK',
            value: 'OK',
            selected: field.value === 'OK',
            disabled: false
        },
        {
            id: '2',
            label: 'N/A',
            value: 'NA',
            selected: field.value === 'NA',
            disabled: false
        },
        {
            id: '3',
            label: 'Puch List',
            value: 'Punchlist',
            selected: field.value === 'Punchlist',
            disabled: false
        }]);

    // Effects
    useEffect(() => {
        setRadioButtons(prevState => prevState.map(elem => {
            return { ...elem, disabled: props.disabled }
        }))
    }, [props.disabled])

    // Handler
    const onPressRadioButton = radioButtonsArray => {
        setRadioButtons(radioButtonsArray)
        const selectedValue = radioButtonsArray.find(elem => elem.selected)?.value
        if (selectedValue) {
            onValueChange(selectedValue)
        }
    }

    return (
        <View style={styles.formBase}>
            <Text>{props.name} - {label}</Text>
            <RadioGroup
                layout='row'
                radioButtons={radioButtons}
                onPress={onPressRadioButton}
            />
            {meta.error &&
                <Text style={styles.formError}>{meta.error}</Text>}
        </View>

    )
}