import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    elementos: [],
    tareas: [],
    registros: [],
    loading: false,
}

const info = createSlice({
    name: 'info',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload
        },
        setElementos(state, action) {
            state.elementos = action.payload
        },
        modElementoCertificado(state, action) {
            const elementoIndex = state.elementos.findIndex(elem => elem.id === action.payload)
            if (elementoIndex !== -1) {
                let registrosCount = state.elementos[elementoIndex].registros
                const tareas = state.elementos[elementoIndex].tareas
                if (registrosCount < tareas) {
                    registrosCount++
                    state.elementos[elementoIndex].registros = registrosCount
                    let porcentaje = (registrosCount / tareas) * 100
                    porcentaje = parseInt(porcentaje * 10) / 10
                    state.elementos[elementoIndex].porcentaje = porcentaje.toFixed(1)                    
                }
            }
        },
        setElementoOffline(state, action) {
            const elementoIndex = state.elementos.findIndex(elem => elem.id === action.payload)
            if (elementoIndex !== -1) {
                state.elementos[elementoIndex].offline = true
            }
        },
        setTareas(state, action) {
            state.tareas = action.payload
        },
        setRegistros(state, action) {
            state.registros = action.payload
        },
        updateRegistroStore(state, action) {
            state.registros = state.registros.map(reg => reg.id === action.payload.id ? action.payload : reg)
        },
        addRegistroStore(state, action) {
            const registroIndex = state.registros.findIndex(reg => reg.elemento === action.payload?.elemento && reg.tarea === action.payload?.tarea)
            if (registroIndex !== -1) {
                state.registros[registroIndex] = action.payload
            } else {
                state.registros = [...state.registros, action.payload]
            }
        }
    }
})

export const {
    setElementos, modElementoCertificado, setElementoOffline,
    setTareas,
    setRegistros, updateRegistroStore, addRegistroStore,
    setLoading
} = info.actions
export default info.reducer