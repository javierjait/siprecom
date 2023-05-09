import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    checking: false,        
    uid: null,
    logged: false,
    authError: '',
    nombre: null,
    email: null,
    token: null,
    proyecto: '',
    proyectoCliente: '',
    proyectoCodigo: '',
    proyectoContratista: '',
    proyectoEstado: '',
    proyectoNombre: ''
}

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            return {
                ...state,
                checking: false,                                
                ...action.payload
            }            
        },
        checking(state, action) {           
            state.checking = action.payload
            state.authError = ''
        },
        error(state, action) {
            state.authError = action.payload            
        }
    }
})

export const { login, checking, error } = auth.actions
export default auth.reducer