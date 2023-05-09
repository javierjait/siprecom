import { createAction } from "@reduxjs/toolkit";
import { fetchConToken, fetchSinToken } from "../../helpers/fetch";

// actions
import { error, checking, login } from "../reducers/auth";

const startLogin = (email, password) => {
    return async (dispatch) => {
        dispatch(checking(true))
        const resp = await fetchSinToken('auth/login', { email, password }, 'POST')
        dispatch(checking(false))
        if (resp.ok || resp.status === 400) {
            const body = await resp.json()

            if (body.token) {
                const usuario = {
                    logged: true,
                    uid: body.usuario.uid,
                    token: body.token,
                    nombre: body.usuario.nombre,
                    email: body.usuario.email,
                    proyecto: body.usuario.proyecto,
                    proyectoCliente: body.proyectoCliente,
                    proyectoCodigo: body.proyectoCodigo,
                    proyectoContratista: body.proyectoContratista,
                    proyectoEstado: body.proyectoEstado,
                    proyectoNombre: body.proyectoNombre,
                    cargo: body.usuario.cargo,
                    empresa: body.usuario.empresa,
                    rol: body.usuario.rol
                }

                dispatch(login(usuario))
            } else {
                dispatch(error(body.msg))
            }
        } else {
            dispatch(error(resp))
        }
    }
}

const refreshToken = () => {
    return async (dispatch) => {
        const resp = await fetchConToken('auth/renew')
        if (resp && resp.ok) {
            const body = await resp.json()

            if (body.token) {
                dispatch(login({ logged: true, ...body }))
            }
        }
    }
}

const logout = createAction('auth/logout')

export {
    startLogin,
    refreshToken,
    logout
}