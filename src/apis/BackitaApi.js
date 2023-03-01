import axios from "axios";

//Api utilizada para todos los servicios api/v1
export const generalApiV1 = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/"
})

//Api utilizada para todos los servicios api/v1/system
export const generalSystemApi = axios.create({
    baseURL: "https://backend-software-ganadero.azurewebsites.net/api/v1/system/"
})
 