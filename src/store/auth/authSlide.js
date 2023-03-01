import { createSlice } from "@reduxjs/toolkit";

//Aqui se definen y manejan todas las variables que el usuario necesita mantener a lo largo de su navegación por la aplicación
export const authSlice = createSlice({
    name : "auth",
    initialState : {},
    reducers: {
        idSesion: (state ,action) =>{
            state.idSesion= action.payload
        },
        login : (state ,action) =>{
            state.user= action.payload
        },
        logout : (state ,payload) =>{
            state.idSesion=null
            state.user= null
            state.establecimientos=null
            state.establecimiento = null
            state.animales= null
            state.successMessage= null
            state.errorMessage=null
            state.loadComponent= null
        },
        establecimientos:  (state, action) => {
            state.establecimientos = action.payload
        },
        establecimiento:  (state, action) => {
            state.establecimiento = action.payload
        },
        animales : (state ,action) =>{
            state.animales= action.payload
        },
        tPesadas : (state ,action) =>{
            state.tPesadas= action.payload
        },
        tEcografias : (state ,action) =>{
            state.tEcografias= action.payload
        },
        tSanitarios : (state ,action) =>{
            state.tSanitarios= action.payload
        },
        successMessage : (state ,action) =>{
            state.successMessage= action.payload
        }, 
        errorMessage : (state ,action) =>{
            state.errorMessage= action.payload
        }, 
        loadComponent : (state ,action) =>{
            state.loadComponent= action.payload
        }
    }
});

export const {idSesion, login, logout, establecimientos, establecimiento,tPesadas,tEcografias,tSanitarios, successMessage, errorMessage, loadComponent} = authSlice.actions;
//export const {login, logout, checkingCredentials, establecimientos, errorMessage, animales, successMessage, establecimiento, loadComponent} = authSlice.actions;
export const selectIdSesion = (state) => state.auth.idSesion;
export const selectUser = (state) => state.auth.user;
export const selectEstablecimientos = (state) => state.auth.establecimientos
export const selectEstablecimiento = (state) => state.auth.establecimiento
export const selectPesadas = (state) => state.auth.tPesadas
export const selectEcografias = (state) => state.auth.tEcografias
export const selectSanitarios = (state) => state.auth.tSanitarios
export const selectErrorMessage = (state) => state.auth.errorMessage
export const selectSuccessMessage = (state) => state.auth.successMessage
export const selectLoadComponent = (state) => state.auth.loadComponent
//export const selectAnimales = (state) => state.auth.animales




