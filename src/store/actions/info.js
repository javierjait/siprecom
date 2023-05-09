// Actions
import {
    setElementos, setElementoOffline, modElementoCertificado,
    setTareas, setRegistros, updateRegistroStore, addRegistroStore,
    setLoading
} from "../reducers/info"
import { refreshToken } from "./auth"

// Helpers
import {
    fetchConToken,
    updateRegistro as updateRegistroFetch,
    addRegistro as addRegistroFetch
} from "../../helpers/fetch"
import { addToStorage } from "../../helpers/storage"

const loadElementos = () => {
    return async (dispatch) => {
        dispatch(setLoading(true))
        const resp = await fetchConToken('elementos/porcentaje?limite=0', undefined, 'GET')
        if (resp && resp.ok) {
            const body = await resp.json()

            dispatch(setElementos(body.elementos))
            dispatch(refreshToken())
        }
        dispatch(setLoading(false))
    }
}

const loadTareas = () => {
    return async (dispatch) => {
        const resp = await fetchConToken('tareas/?limite=0', undefined, 'GET')
        if (resp && resp.ok) {
            const body = await resp.json()

            dispatch(setTareas(body.tareas))
        }
    }
}

const loadRegistros = () => {
    return async (dispatch, state) => {
        const uid = state()?.auth?.uid
        const resp = await fetchConToken('registros/?limite=0', undefined, 'GET')
        if (resp && resp.ok) {
            const body = await resp.json()

            let registros = body.registros

            /*if (isNonEmptyString(uid)) {
                try {
                    const str = await getData(uid)                    
                    if (str !== null) {
                        const res = JSON.parse(str)
                        res.forEach(registro => {
                            if (registro.id) {                                
                                registros = registros.map(reg => {
                                    if (reg.id === registro.id) {
                                        reg = { ...registro }
                                    }
                                    return reg
                                })
                            } else {
                                registros = [...registros, registro]
                            }
                        })
                    }
                } catch (err) {
                    console.error(err)
                }
            }*/

            dispatch(setRegistros(registros))
        }
    }
}

const addRegistro = registro => {
    return async (dispatch, state) => {
        dispatch(setLoading(true))
        const { uid } = state()?.auth

        const res = await addRegistroFetch(registro)
        if (res && res.ok) {
            const body = await res.json()

            if (body.id) {
                registro.id = body.id
                dispatch(addRegistroStore(registro))
            }
        } else {
            addToStorage(uid, registro)
            dispatch(addRegistroStore(registro))            
            dispatch(setElementoOffline(registro.elemento))
        }
        dispatch(setLoading(false))
    }
}

const updateRegistro = registro => {
    return async (dispatch, state) => {
        dispatch(setLoading(true))
        const { uid } = state().auth
        const prevRegistro = state().info.registros.find(reg => reg.id === registro.id)

        dispatch(updateRegistroStore(registro))

        const res = await updateRegistroFetch(registro)
        if (res === undefined || !res?.ok) {
            addToStorage(uid, registro)
            if (prevRegistro?.estado !== registro.estado && registro.estado === 'CERTIFICADO') {
                dispatch(modElementoCertificado(registro.elemento))
            }
            dispatch(setElementoOffline(registro.elemento))
        } else {
            dispatch(loadElementos())
        }

        dispatch(setLoading(false))
    }
}

export {
    loadElementos,
    loadTareas,
    loadRegistros,
    addRegistro,
    updateRegistro
}