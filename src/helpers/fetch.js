import * as FileSystem from 'expo-file-system';
import { getToken } from "../store";


const baseUrl = 'https://restserver-siprecom.herokuapp.com/api'

const fetchSinToken = (endpoint, data, method = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;

    return fetch(url, {
        method,
        headers: {
            'Content-type': 'application/json'
        },
        ...method !== 'GET' && { body: JSON.stringify(data) }
    })
}

const fetchConToken = (endpoint, data, method = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;
    const token = getToken()

    if (token !== undefined) {
        return fetch(url, {
            method,
            headers: {
                'Content-type': 'application/json',
                'x-token': token
            },
            ...method !== 'GET' && { body: JSON.stringify(data) }
        })
    }
}

const addRegistro = async (registro) => {
    try {
        const res = await fetchConToken('registros', registro, 'POST')
        return res
    } catch (err) {
        console.error(err)
        return undefined
    }
}


const updateRegistro = async (registro) => {
    try {
        const res = await fetchConToken(`registros/${registro.id}`, registro, 'PUT')
        return res
    } catch (err) {
        console.error(err)
        return undefined
    }
}

const getPDF = async (id_registro) => {
    const token = getToken()

    try {                
        const res = await FileSystem.downloadAsync(`${baseUrl}/reportes/registro/${id_registro}`,
            `${FileSystem.cacheDirectory}${id_registro}.pdf`, {
            headers: {
                'x-token': token
            },
        })
        
        return res?.uri
    } catch (err) {
        console.error(err)
    }
}

export {
    fetchConToken,
    fetchSinToken,
    addRegistro,
    updateRegistro,
    getPDF
}