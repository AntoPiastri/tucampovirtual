import axios from "axios";


export const loginApi = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/system/"
})


export const getAllEstablecimientos = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/system/"
})


export const generalApi = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/system/signUp"
})
