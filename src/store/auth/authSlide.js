import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name : "auth",
    initialState : {
        estado : "not-auth" , //"not-auth", "auth", checking
        uid : null,
        email : null,
        displayName : null,
    },
    reducers: {

        login : (state ,action) =>{
            state.user= action.payload

        },
        logout : (state ,payload) =>{
            state.user= null
            state.establecimientos=null
            state.errorMessage=null
            state.successMessage= null
            state.establecimiento = null
            state.animales= null
            state.loadComponent= null

        },
        successMessage : (state ,action) =>{
            state.successMessage= action.payload

        }, 

        establecimientos:  (state, action) => {
            state.establecimientos = action.payload
        },
        establecimiento:  (state, action) => {
            state.establecimiento = action.payload
        },

        errorMessage : (state ,action) =>{
            state.errorMessage= action.payload

        }, 

        animales : (state ,action) =>{
            state.animales= action.payload

        },
        loadComponent : (state ,action) =>{
            state.loadComponent= action.payload

        }
    }
});

export const {registro, login, logout, checkingCredentials, establecimientos, errorMessage, animales, successMessage, establecimiento, loadComponent} = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectEstablecimientos = (state) => state.auth.establecimientos
export const selectErrorMessage = (state) => state.auth.errorMessage
export const selectSuccessMessage = (state) => state.auth.successMessage
export const selectAnimales = (state) => state.auth.animales
export const selectEstablecimiento = (state) => state.auth.establecimiento
export const selectLoadComponent = (state) => state.auth.loadComponent


