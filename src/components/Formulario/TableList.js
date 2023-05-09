import { View, Text, ScrollView, Button, useWindowDimensions } from 'react-native'

// Components
import { MyTextInput } from './TextInput'
import { MySelect } from './Select'
import { MyRadioButtonGroup } from './RadioButtonGroup'
import { MyDatePicker } from './DatePicker'

// 3rd party component
import { FieldArray } from 'formik'

// Styles
import { styles } from '../../styles'
import { colors } from '../../styles/colors'

export const MyList = ({ label, ...props }) => {
    const { items, disabled } = props
    const { width } = useWindowDimensions()

    const valoresIniciales = items.reduce((acc, item) => {
        acc[item.name] = item.value
        return acc
    }, {})

    return (
        <View>
            <FieldArray name={props.name}>
                {(fieldArrayProps) => {
                    const { push, remove, form } = fieldArrayProps
                    const { values, setFieldValue } = form
                    const indice = Object.keys(values).indexOf(props.name)
                    const encabezado = items.map(item => item.label)
                    return (
                        <>
                            <ScrollView horizontal={true}>
                                <View>
                                    <ListHeader items={encabezado} width={width} />
                                    {Object.values(values)[indice].map((_, index) =>
                                        <View key={index} style={{
                                            flexDirection: 'row',
                                            paddingVertical: 10,
                                            backgroundColor: index % 2 ? 'transparent' : colors.otherRowBackground
                                        }}>
                                            {Object.keys(Object.values(values)[indice].map((item) => item)[0]).map((item, index2) => {
                                                switch (items[index2].type) {
                                                    case 'input':
                                                    case 'password':
                                                    case 'email':
                                                        return <MyTextInput
                                                            key={items[index2].name}
                                                            type={items[index2].type}
                                                            name={`${props.name}[${index}].${item}`}
                                                            placeholder={items[index2].placeholder}
                                                            onChangeText={value => setFieldValue(`${props.name}[${index}].${item}`, value, false)}
                                                            style={width > 480 ? styles.listComponentWidthLandscape : styles.listComponentWidthPortrait}
                                                            editable={!disabled}
                                                        />
                                                    case 'select':
                                                        return <MySelect
                                                            key={items[index2].name}
                                                            name={`${props.name}[${index}].${item}`}
                                                            options={items[index2].options}
                                                            onValueChange={value => setFieldValue(`${props.name}[${index}].${item}`, value, true)}
                                                            enabled={!disabled}
                                                            style={width > 480 ? styles.listComponentWidthLandscape : styles.listComponentWidthPortrait}
                                                        />
                                                    case 'radiobuttongroup':
                                                        return <MyRadioButtonGroup
                                                            key={items[index2].name}
                                                            name={`${props.name}[${index}].${item}`}                                                            
                                                            onValueChange={value => setFieldValue(`${props.name}[${index}].${item}`, value, true)}
                                                            disabled={disabled}
                                                            style={width > 480 ? styles.listComponentWidthLandscape : styles.listComponentWidthPortrait}
                                                            vertical={true}
                                                        />
                                                    case 'date':
                                                        return <MyDatePicker
                                                            key={items[index2].name}
                                                            name={`${props.name}[${index}].${item}`}
                                                            placeholder={items[index2].name}
                                                            onValueChange={value => setFieldValue(`${props.name}[${index}].${item}`, value, false)}
                                                            disabled={disabled}
                                                            style={width > 480 ? styles.listComponentWidthLandscape : styles.listComponentWidthPortrait}
                                                        />
                                                }
                                            })}
                                            {index !== 0 && <View style={{
                                                height: 36
                                            }}>
                                                <Button title='Delete' disabled={disabled} onPress={() => remove(index)} />
                                            </View>}
                                        </View>)}
                                </View>
                            </ScrollView>
                            <Button title='Agregar' disabled={disabled} onPress={() => push(valoresIniciales)} />
                        </>
                    )
                }}
            </FieldArray>
        </View>
    )
}

const ListHeader = ({ items, width }) => {
    return (
        <View style={[styles.rowBase, {
            backgroundColor: colors.rowBackground,
        }]}>
            {items.map((item, i) => <View key={i} style={width > 480 ? styles.listComponentWidthLandscape : styles.listComponentWidthPortrait}>
                <Text style={{
                    textTransform: 'uppercase'
                }}>{item}</Text>
            </View>)}
        </View>
    )
}