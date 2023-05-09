// Redux
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
//import createSecureStore from "redux-persist-expo-securestore";

// Reducers
import auth from './auth'
import info from './info'
import { deleteKey } from '../../helpers/storage';

// Secure storage
//const secureStorage = createSecureStore();

// redux persist
const authPersistConfig = {
    key: 'auth',
    /*whitelist: ['uid', 'logged', 'nombre', 'email', 'token',
        'proyecto', 'proyectoCliente', 'proyectoCodigo', 'proyectoContratista', 'proyectoEstado', 'proyectoNombre'],*/
    blacklist: ['checking', 'authError'],
    storage: AsyncStorage
}

const infoPersisteConfig = {
    key: 'info',
    blacklist: ['loading'],
    storage: AsyncStorage
}

const combinedReducer = combineReducers({
    auth: persistReducer(authPersistConfig, auth),
    info: persistReducer(infoPersisteConfig, info)    
})

const reducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state    
    if (action.type === 'auth/logout') {                 
        state = {}     
        deleteKey('persist:info')
        deleteKey('persist:auth')
    }

    return combinedReducer(state, action);
}

export {
    reducer
}