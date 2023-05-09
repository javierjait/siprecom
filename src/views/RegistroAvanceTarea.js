import { View, TouchableOpacity, Text, useWindowDimensions } from "react-native"
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'

// Redux
import { useSelector } from "react-redux"

// 3rd party components
import { FlashList } from "@shopify/flash-list"

// Helpers
import { formatDate, isNonEmptyString } from "../helpers";

// Styles
import { styles } from "../styles"
import { colors } from "../styles/colors"

const RegistroAvanceTarea = ({ navigation, route }) => {
    const { id_tipo, id_tag } = route.params
    const { width } = useWindowDimensions()

    // Redux
    const tareas = useSelector(state => state.info.tareas.filter(elem => elem.tipo._id === id_tipo))
    const { registros } = useSelector(state => state.info)

    const Item = ({ item, index }) => {
        const registro = registros.find(registro => registro.elemento === id_tag && registro.tarea === item.id)

        const estadoCertificado = () => {
            if (registro?.firmas?.length > 1 || registro?.estado === 'CERTIFICADO') {
                return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="check-circle" size={18} color={colors.success} />
                    <Text style={{ marginLeft: 5 }}>CERTIFICADO</Text>
                </View>
            }

            if (registro?.firmas) {
                return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5 name="pen" size={14} color={colors.process} />
                    <Text style={{ marginLeft: 5 }}>EN PROCESO</Text>
                </View>
            }

            return (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="pause-circle" size={18} color={colors.warning} />
                <Text style={{ marginLeft: 5 }}>{isNonEmptyString(registro?.estado) ? registro.estado : 'SIN INICIAR'}</Text>
            </View>)
        }

        //const estado = registros.find(registro => registro.elemento === id_tag && registro.tarea === item.id)?.estado
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Formulario', { id_tag, tarea: item, tareaNombre: item.nombre })}>
                <View style={[styles.rowBase, {
                    backgroundColor: index % 2 ? 'transparent' : colors.otherRowBackground
                }]}>
                    <View style={{ flex: 2 }}>
                        <Text>{item.nombre}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: width > 480 ? 'flex-start' : 'flex-end' }}>
                        <Text>{estadoCertificado()}</Text>
                    </View>
                    {width > 480 && <View style={{ flex: 2, flexDirection: 'row' }}>
                        {registro?.firmas && Array.isArray(registro.firmas) && registro.firmas.map(({ nombre, fechaFirma }, index) => {
                            return <View key={index} style={{ flex: 1 }}>
                                <Text>{nombre}</Text>
                                <Text>{formatDate(new Date(fechaFirma))}</Text>
                            </View>
                        })}
                    </View>}
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.containerTags}>
            <FlashList
                data={tareas}
                renderItem={Item}
                ListHeaderComponent={<Header width={width} />}
                estimatedItemSize={50} />
            <StatusBar style='dark' />
        </View>
    )
}

const Header = ({ width }) => {
    return (
        <View style={styles.rowHeaderBase}>
            <View style={{ flex: 2 }}>
                <Text style={styles.rowHeaderText}>NOMBRE</Text>
            </View>
            <View style={{ flex: 1, alignItems: width > 480 ? 'flex-start' : 'flex-end' }}>
                <Text style={styles.rowHeaderText}>ESTADO</Text>
            </View>
            {width > 480 && <View style={{ flex: 2 }}>
                <Text style={styles.rowHeaderText}>FIRMAS</Text>
            </View>}
        </View>
    )
}

export default RegistroAvanceTarea