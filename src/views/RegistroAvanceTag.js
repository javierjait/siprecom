import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, TextInput, useWindowDimensions } from "react-native"
import { StatusBar } from 'expo-status-bar';

// Redux
import { useSelector } from "react-redux"

// Components
import Avance from "../components/Avance"

// 3rd party components
import { FlashList } from "@shopify/flash-list"

// Styles
import { styles } from "../styles"
import { colors } from "../styles/colors"

const RegistroAvanceTag = ({ navigation }) => {
    const [elementosBuscados, setElementosBuscados] = useState([])
    const [filtro, setFiltro] = useState('')
    const { width } = useWindowDimensions()

    // Redux    
    const { elementos } = useSelector(state => state.info)

    useEffect(() => {
        const filtered = elementos.filter(({ tag }) => tag.includes(filtro.toUpperCase()))
        if (filtered) {
            setElementosBuscados(filtered)
        } else {
            setElementosBuscados(elementos)
        }
    }, [elementos, filtro])

    // Item
    const Item = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('AvanceTarea', { id_tipo: item.tipo._id, tag: item.tag, id_tag: item._id })}>
                <View style={[styles.rowBase, {
                    backgroundColor: item.offline ? colors.offlineRowBackground : index % 2 ? 'transparent' : colors.otherRowBackground
                }]}>
                    <Text style={{ flex: width > 480 ? 2 : 3 }}>{item.tag}</Text>
                    {width > 480 && <Text style={{ flex: 3 }}>{item.nombre}</Text>}
                    <Avance avance={item.porcentaje} style={{ flex: 1 }} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.containerTags}>
            <TextInput
                name='filtroTags'
                value={filtro}
                onChangeText={setFiltro}
                autoCapitalize='characters'
                placeholder="Buscar"
                style={[styles.formTextInput,
                {
                    marginBottom: 10
                }]}
            />
            <FlashList
                data={elementosBuscados}
                renderItem={Item}
                ListHeaderComponent={<Header width={width} />}
                estimatedItemSize={50}
            />
            <StatusBar style='dark' />
        </View>
    )
}

const Header = ({ width }) => {
    return (
        <View style={styles.rowHeaderBase}>
            <View style={{ flex: width > 480 ? 2 : 3 }}>
                <Text style={styles.rowHeaderText}>TAG</Text>
            </View>
            {width > 480 && <View style={{ flex: 3 }}>
                <Text style={styles.rowHeaderText}>NOMBRE</Text>
            </View>}
            <View style={{ flex: 1 }}>
                <Text style={styles.rowHeaderText}>AVANCE</Text>
            </View>
        </View>
    )
}

export default RegistroAvanceTag