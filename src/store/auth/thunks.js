import { generalApi, getAllEstablecimientos, loginApi } from "../../apis";
import { errorMessage, establecimiento, establecimientos, loadComponent, login, logout, successMessage } from "./authSlide"



export const registroUsuario = (name, email, password) => {
    return async (dispatch) => {



        try {
            const resp = await generalApi.post("https://backend-software-ganadero.azurewebsites.net/api/v1/system/signUp", { name, email, password });
            if (resp.status == 201) {
                console.log(resp)
                dispatch(checkingAuth(email, password))
            }

        }
        catch (error) {
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))

        }
    }

}

export const checkingAuth = (email, password) => {
    return async (dispatch) => {

        try {
            const resp = await loginApi.post("signIn", { email, password });
            if (resp.status == 200) return dispatch(login({ isLogged: true, token: resp.data.data.accessToken, nombre: resp.data.data.name, email: email }));
            
        }
        catch (error) {
            let errorMessageText = "";
            if(error.response.status=="400" && error.response.data.message=="Invalid username or password")
            {
                errorMessageText = "La contraseña no es válida o el valor del email no pertenece a un usuario registrado"
                
            }
            else if (error.response.status=="403")
            {
                errorMessageText = "El usuario se encuentra bloqueado"
            }
            else if (error.response.status=="404")
            {
                errorMessageText = "El usuario no posee una contraseña"
            }
            else if (error.response.status=="500")
            {
                errorMessageText = "Error interno en el servidor"
            }
            else
            {
                errorMessageText = error.response.data.message
            }
            dispatch(errorMessage(errorMessageText))

        }
    }

}

export const updateUser = (email, token, name, password, type) => {
    return async (dispatch) => {
        const persistToken = token
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        if (type = "name") {
            try {
                const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/user/update", { email, name }, { headers }).catch(function (error) { console.log('Error', error.message); })
                console.log(resp)
                dispatch(successMessage(resp.data.message))
                dispatch(login({ isLogged: true, token: persistToken, nombre: resp.data.data.user.name, email: email }))
            }
            catch (error) {
                dispatch(errorMessage(error.response.data.message))
            }


        }
        else {
            try {
                const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/user/update", { email, password }, { headers }).catch(function (error) { console.log('Error', error.message); })

                console.log(resp)
                dispatch(successMessage(resp.data.message))
            }
            catch (error) {
                dispatch(errorMessage(error.response.data.message))
            }
        }



    }
}
export const deleteUser = (email, token,) => {
    return async (dispatch) => {

        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        if (type = "name") {
            try {
                const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/user/delete", { email }, { headers }).catch(function (error) { console.log('Error', error.message); })
                console.log(resp)
                dispatch(successMessage(resp.data.message))
            }
            catch (error) {
                dispatch(errorMessage(error.response.data.message))
            }


        }
        else {
            try {
                const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/user/update", { email, password }, { headers }).catch(function (error) { console.log('Error', error.message); })

                console.log(resp)
                dispatch(successMessage(resp.data.message))
            }
            catch (error) {
                dispatch(errorMessage(error.response.data.message))
            }
        }



    }
}

export const closeSession = () => {
    return async (dispatch) => {


        dispatch(logout());
        console.log("Cerrar Sesión")

    }
}


export const testEst = (email, token) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/establishment/get/all", { email }, { headers }).catch(function (error) { console.log('Error', error.message); })
        dispatch(establecimientos(resp.data.data.establishments))

    }
}




export const agregarEstablecimiento = (email, token, nombreEstablecimiento, nombreProductor, dicoseFisico, rubroPrincipal, cantidadDicosePropiedad, valoresDicosePropiedad) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/establishment/create", { email, nombreEstablecimiento, nombreProductor, dicoseFisico, rubroPrincipal, cantidadDicosePropiedad, valoresDicosePropiedad }, { headers })
            dispatch(successMessage(resp.data.message))

        }
        catch (error) {
            dispatch(errorMessage(error.response.data.message))
        }
    }

}



export const obtenerAnimales = async (email, token, dicoseFisico) => {

    token = "Bearer " + token;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": token
    }
    const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/animal/get/all/byEstablishment", { email, dicoseFisico }, { headers })
    //dispatch(animales(resp.data.data.animals))
    return resp.data.data.animals;



}

export const sendFiletoBack = (email, token, PlanillaAnimales) => {
    return async (dispatch) => {
        console.log(email)
        console.log(token)
        console.log(PlanillaAnimales)
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        }

        try {
            const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/animalSheet", { email, PlanillaAnimales }, { headers })
            console.log(resp)
            dispatch(successMessage(resp.data.message))
        }
        catch (error) {
            console.log(error)
            dispatch(errorMessage(error.response.data.message))
        }
        dispatch(loadComponent(Math.random()))
    }
}

export const sendFileTrabajoPesadatoBack = (email, token, PlanillaPesadas) => {
    return async (dispatch) => {
        console.log(email)
        console.log(token)
        console.log(PlanillaPesadas)
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        }

        try {
            const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/pesadaSheet", { email, PlanillaPesadas }, { headers })
            console.log(resp)
            dispatch(successMessage(resp.data.message))
        }
        catch (error) {
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))
        }

    }
}

export const sendFileTrabajoEcografiatoBack = (email, token, encargadoTrabajo, PlanillaEcografias) => {
    return async (dispatch) => {
        console.log(email)
        console.log(token)
        console.log(encargadoTrabajo)
        console.log(PlanillaEcografias)
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        }

        try {
            const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/ecografiaSheet", { email, encargadoTrabajo, PlanillaEcografias }, { headers })
            console.log(resp)
            dispatch(successMessage(resp.data.message))
        }
        catch (error) {
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))
        }

    }
}

export const sendFileTrabajoSanitariosGarrapatas = (email, token, principioActivo, nombreLote, crearAlerta, PlanillaControlGarrapatas) => {
    return async (dispatch) => {
        console.log(email)
        console.log(token)
        console.log(principioActivo)
        console.log(nombreLote)
        console.log(crearAlerta)
        console.log(PlanillaControlGarrapatas)
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        }

        try {
            const resp = await getAllEstablecimientos.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/controlGarrapataSheet", { email, principioActivo, nombreLote, crearAlerta, PlanillaControlGarrapatas }, { headers })
            console.log(resp)
            dispatch(successMessage(resp.data.message))
        }
        catch (error) {
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))
        }

    }
}


export const startServices = () => {
    return async (dispatch) => {
        try {
            const resp = await getAllEstablecimientos.get("https://backend-software-ganadero.azurewebsites.net/testServiceConnection")
            console.log(resp)
        }
        catch (error) {
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))
        }

    }
}


export const newError = (error) => {
    return async (dispatch) => {
        dispatch(errorMessage(error))
    }

}

export const cleanMessagge = () => {
    return async (dispatch) => {
        dispatch(errorMessage(null))
        dispatch(successMessage(null))
    }

}

export const saveInfoEstablecimiento = (nombre, dicoseFisico) => {
    return async (dispatch) => {
        dispatch(establecimiento({ nombre: nombre, dicoseFisico: dicoseFisico }))
    }

}