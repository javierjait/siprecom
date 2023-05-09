import AsyncStorage from "@react-native-async-storage/async-storage"
import { isNonEmptyString, isValidString } from "."

const storeData = async (key, value) => {
    try {
        if (!isValidString(value)) value = JSON.stringify(value)
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.error(e)
    }
}

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        return value
    } catch (e) {
        console.error(e)
    }
}

const deleteKey = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
        return true
    } catch {
        return false
    }
}

const clearStorage = () => {
    AsyncStorage.clear()
}

const addToStorage = async (uid, registro) => {
    if (!isNonEmptyString(uid)) {
        return
    }
    
    let datosOffline    
    
    const st = await getData(uid)
    if (st === null) {
        datosOffline = [registro]
    } else {
        datosOffline = JSON.parse(st)        
        const registroIndex = datosOffline.findIndex(reg => reg.id === undefined && reg.elemento === registro.elemento && reg.tarea === registro.tarea)
        if (registroIndex !== -1) {
            datosOffline[registroIndex] = registro
        } else {
            datosOffline = [...datosOffline, registro]
        }

    }    
    storeData(uid, datosOffline)    
}

export { getData, storeData, deleteKey, clearStorage, addToStorage }