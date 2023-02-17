import axios from "axios";


export const loginApi = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/system/"
})


export const generalApiV1 = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/"
})


export const generalSystemApi = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/system/"
})
 