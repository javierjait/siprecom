import { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { Feather, FontAwesome5 } from '@expo/vector-icons'

// Navigation
import { useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/actions/auth"
import { loadElementos, loadRegistros, loadTareas } from "../store/actions/info"

// Views
import Login from "../views/Login"
import RegistroAvanceTag from "../views/RegistroAvanceTag"
import RegistroAvanceTarea from "../views/RegistroAvanceTarea"
import RegistroFormulario from "../views/RegistroFormulario"

// Components
import Loading from "../components/Loading"
import { SyncModal } from "../components/Modals"

// Helpers
import { deleteKey, getData } from "../helpers/storage"
import { isNonEmptyString } from "../helpers"
import { addRegistro, updateRegistro } from "../helpers/fetch"

const LogoutButton = ({ style, size = 24 }) => {
    // Redux
    const dispatch = useDispatch()

    return (
        <TouchableOpacity style={style} onPress={() => dispatch(logout())}>
            <Feather name="log-out" size={size} color="black" />
        </TouchableOpacity>
    )
}

const SyncButton = ({ style, size = 20, event, disabled }) => {
    return (
        <TouchableOpacity
            style={style}
            onPress={() => !disabled && event && event()}
            disabled={disabled}
        >
            <FontAwesome5 name="sync" size={size} color="black" />
        </TouchableOpacity>
    )
}

const Navigator = ({ offline }) => {
    const Stack = createNativeStackNavigator()
    const navigation = useNavigation()

    // State
    const [offlineData, setOfflineData] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    // Redux    
    const dispatch = useDispatch()
    const { logged, uid } = useSelector(state => state.auth)
    const { loading } = useSelector(state => state.info)

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            
            checkOfflineData()
        });

        return unsubscribe
    }, [navigation])

    useEffect(() => {
        if (!offline) {
            checkOfflineData()
        }
    }, [offline])

    useEffect(() => {
        if (uid !== null)
            getTagTareaRegistros()
    }, [uid])

    // handlers
    const getTagTareaRegistros = async () => {
        if (!offline) {
            dispatch(loadElementos())
            dispatch(loadTareas())
            dispatch(loadRegistros())
        }
    }

    const checkOfflineData = () => {
        if (isNonEmptyString(uid)) {
            getData(uid).then(res => setOfflineData(res !== null)).catch(err => console.error(err))
        }
    }

    // Handlers
    const handlerSync = async () => {
        if (isNonEmptyString(uid)) {
            setShowLoading(true)
            str = await getData(uid)
            if (str !== null) {
                try {
                    const res = JSON.parse(str)
                                        
                    //console.log('antes for')
                    for await (const registro of res) {                        
                        //console.log(registro)
                        if (registro.id) {
                            //console.log(registro.id)
                            await updateRegistro(registro)
                        } else {
                            await addRegistro(registro)
                        }
                    }                    
                    //console.log('despues form')

                    setOfflineData(false)
                    deleteKey(uid)
                    getTagTareaRegistros()
                } catch (err) {
                    console.error(err)
                }
            }

            setShowLoading(false)
        }
    }

    const modalEvent = operation => {
        setModalVisible(false)
        if (operation === 'sync') {
            handlerSync()
        } else if (operation === 'delete') {
            setOfflineData(false)
            deleteKey(uid)
            getTagTareaRegistros()
        }
    }

    return (
        <>
            <Stack.Navigator>
                {logged ?
                    <>
                        <Stack.Screen
                            name='AvanceTag'
                            options={{
                                title: 'Registro de avance',
                                headerRight: () => <>
                                    {offlineData && !offline && <SyncButton style={{ marginRight: 15 }} event={() => setModalVisible(true)} disabled={showLoading} />}
                                    <LogoutButton />
                                </>
                            }}
                        >
                            {props => <RegistroAvanceTag {...props} />}
                        </Stack.Screen>
                        <Stack.Screen
                            name='AvanceTarea'
                            options={
                                ({ route }) => ({
                                    title: route.params.tag,
                                    headerRight: () => <LogoutButton />
                                })
                            }
                            component={RegistroAvanceTarea} />
                        <Stack.Screen
                            name='Formulario'
                            options={
                                ({ route }) => ({
                                    title: route.params.tareaNombre,
                                    headerRight: () => <LogoutButton />
                                })
                            }
                            component={RegistroFormulario} />
                    </>
                    :
                    <Stack.Screen
                        name='Login'
                        options={{
                            headerShown: false
                        }}
                        component={Login} />}
            </Stack.Navigator>
            {(showLoading || loading) && <Loading />}
            {modalVisible && <SyncModal setVisible={setModalVisible} visible={modalVisible} event={modalEvent} />}
        </>
    )
}

export default Navigator