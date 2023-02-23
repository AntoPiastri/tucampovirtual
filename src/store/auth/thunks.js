import { generalApiV1, generalSystemApi, loginApi } from "../../apis";
import { errorMessage, establecimiento, establecimientos, loadComponent, login, logout, successMessage } from "./authSlide"




export const registroUsuario = (name, email, password) => {
    return async (dispatch) => {
        try {
            const resp = await generalSystemApi.post("https://backend-software-ganadero.azurewebsites.net/api/v1/system/signUp", { name, email, password });
            if (resp.status == 201) {
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
            if (error.response.status == "400" && error.response.data.message == "Invalid username or password") {
                errorMessageText = "La contraseña no es válida o el valor del email no pertenece a un usuario registrado"

            }
            else if (error.response.status == "403") {
                errorMessageText = "El usuario se encuentra bloqueado"
            }
            else if (error.response.status == "404") {
                errorMessageText = "El usuario no posee una contraseña"
            }
            else if (error.response.status == "500") {
                errorMessageText = "Error interno en el servidor"
            }
            else {
                errorMessageText = error.response.data.message
            }
            dispatch(errorMessage(errorMessageText))

        }
    }

}
export const sendCodeRecoveryPassword = (email) => {
    return async (dispatch) => {
        const passwordChangeRequestToken = "4ab6bac4a19d71cbda199912f94ae348d7f6c0b0eb1c9271699488644519e8b68007ce33883629aa5c57229be32b0755ac734e4b0cdf71adab6ae3b6f9fff338"
        try {
            const resp = await generalSystemApi.post("requestPasswordChange", { email, passwordChangeRequestToken });
            if (resp.status == 200) {
                dispatch(loadComponent("Success validate mail"))
            }
        }
        catch (error) {
            if (error.response.status == "500") {
                errorMessageText = "Error interno en el servidor"
            }
            else {
                errorMessageText = error.response.data.message
            }
            dispatch(errorMessage(errorMessageText))
        }
    }

}
export const validateCodeRecoveryPassword = (email, userOTPCode) => {
    return async (dispatch) => {
        const otpCodeValidationToken = "d6a363353c1265d07394fce40b840d275f266a29ace2adc8c40a31d78b274e2511363c5445550072d5000bc9bc457b206b9cc23b4e0dde103e7c60eee091f583"
        try {
            const resp = await generalSystemApi.post("validateOTPCode", { email, otpCodeValidationToken, userOTPCode });
            if (resp.status == 200) {
                dispatch(loadComponent("Success validate code"))
            }
        }
        catch (error) {
            let errorMessageText = "";
            if (error.response.status == "401") {
                errorMessageText = "El código ingresado no es válido."
            }
            else if (error.response.status == "403" && error.response.data.message == "OTP Code provided is expired") {
                errorMessageText = "El código fue solicitado hace más de 24hs. Solicita un nuevo código"
            }
            else if (error.response.status == "500") {
                errorMessageText = "Error interno en el servidor"
            }
            else {
                errorMessageText = error.response.data.message
            }
            dispatch(errorMessage(errorMessageText))

        }
    }

}
export const recoveryPassword = (email, userOTPCode, newPassword) => {
    return async (dispatch) => {
        const passwordChangeToken = "a401f500e31be2dbdac6c6581f8a419f11c96ef2a512c324a1aab9b1e9774c9b60d794b7e0e8cf5de0f50b53273996b7dd7b66502eab49ded3e7d9d6248641bc"
        try {
            const resp = await generalSystemApi.post("passwordChange", { email, passwordChangeToken, userOTPCode, newPassword });
            if (resp.status == 200) {
                dispatch(successMessage("Tu contraseña ha sido actualizada con éxito. Inicia sesión con ella."))
                dispatch(loadComponent("Success password change"))
            }
        }
        catch (error) {
            let errorMessageText = "";
            if (error.response.status == "400" && error.response.data.message == "New password could not be same as old password") {
                errorMessageText = "La nueva contraseña no puede ser igual a la contraseña anterior"
            }
            else if (error.response.status == "500") {
                errorMessageText = "Error interno en el servidor"
            }
            else {
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
        console.log(type)
        if (type == "name") {
            try {
                const resp = await generalApiV1.post("user/update", { email, name }, { headers })
                if (resp.status == 200) {
                    dispatch(successMessage("El nombre de usuario se ha actualizado correctamente"))
                    dispatch(login({ isLogged: true, token: persistToken, nombre: resp.data.data.user.name, email: email }))
                }
            }
            catch (error) {
                let errorMessageText = "";
                if (error.response.status == "500") {
                    errorMessageText = "Error interno en el servidor"
                }
                else {
                    errorMessageText = error.response.data.message
                }
                dispatch(errorMessage(errorMessageText))
            }
        }
        else {
            try {
                const resp = await generalApiV1.post("user/update", { email, password }, { headers })
                if (resp.status == 200) {
                    dispatch(successMessage("La contraseña se ha actualizado correctamente"))
                }
            }
            catch (error) {
                let errorMessageText = "";
                if (error.response.status == "500") {
                    errorMessageText = "Error interno en el servidor"
                }
                else if (error.response.status == "400" && error.response.data.message == "New password could not be same as old password") {
                    errorMessageText = "La nueva contraseña no puede ser igual a la contraseña anterior"
                }
                else {
                    errorMessageText = error.response.data.message
                }
                dispatch(errorMessage(errorMessageText))
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
        try 
        {
            const resp = await generalApiV1.post("user/delete", { email }, { headers })
            dispatch(successMessage(resp.data.message))
            dispatch(logout());
        }
        catch (error) 
        {
            dispatch(errorMessage(error.response.data.message))
        }
    }
}

export const closeSession = () => {
    return async (dispatch) => {
        dispatch(logout());
    }
}


export const getEstablecimientos = (email, token) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const resp = await generalApiV1.post("establishment/get/all", { email }, { headers })
            dispatch(establecimientos(resp.data.data.establishments))
        }
        catch (error) {
            let errorMessageText = "";
            if (error.response.status == "404" && error.response.data.message == "No Establishments found of the User") {
                errorMessageText = "Aún no tienes establecimientos registrados."
            }
            else if (error.response.status == "500") {
                errorMessageText = "Error interno en el servidor"
            }
            else {
                errorMessageText = error.response.data.message
            }
            dispatch(errorMessage(errorMessageText))
        }
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
            const resp = await generalApiV1.post("establishment/create", { email, nombreEstablecimiento, nombreProductor, dicoseFisico, rubroPrincipal, cantidadDicosePropiedad, valoresDicosePropiedad }, { headers })
            if (resp.status == 201) {
                dispatch(successMessage("Establecimiento creado con éxito"))
            }
        }
        catch (error) {
            let errorMessageText = "";
            if (error.response.status == "400" && error.response.data.message == "Establishment already registered") {
                errorMessageText = "El establecimiento ya se encuentra registrado"
            }
            else if (error.response.status == "500") {
                errorMessageText = "Error interno en el servidor"
            }
            else {
                errorMessageText = error.response.data.message
            }
            dispatch(errorMessage(errorMessageText))

        }
    }

}



export const obtenerAnimales = async (email, token, dicoseFisico) => {

    token = "Bearer " + token;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": token
    }
    const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/animal/get/all/byEstablishment", { email, dicoseFisico }, { headers })
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
            const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/animalSheet", { email, PlanillaAnimales }, { headers })
            console.log(resp)
            dispatch(successMessage(resp.data.message))
            if (resp.status == 200) {
                let mensaje ={"titulo": "Archivo cargado con éxito", "contenido":"Detalles", "activeButton":false}
                const data = resp.data.data
                const createdAnimals=data.createdAnimals
                const errors=data.errors
                const updatedAnimals=data.updatedAnimals
                if(createdAnimals.length>0)
                {
                    let text= "Se crearon los siguientes animales: "
                    createdAnimals.map(animal  => {text=text+animal.dispositivo+", "})
                    const newText = text.slice(0, -2) 
                    mensaje["create"] = newText
                }
                if(updatedAnimals.length>0)
                {
                    let text= "Se han actualizado los siguientes animales: "
                    updatedAnimals.map(animal  => {text=text+animal.dispositivo+", "})
                    const newText = text.slice(0, -2) 
                    mensaje["update"] = newText
                }
                if(errors.length>0)
                {
                    let text= "Se han encontrado errores en las siguientes filas: "
                    errors.map(animal  => {text=text+animal.row+", "})
                    const newText = text.slice(0, -2) 
                    mensaje["error"] = newText
                }
                dispatch(successMessage(mensaje))
            }
        }
        catch (error) {
            //PENDIENTE DE DEFINICION CON CAMBIO FINAL
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
            const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/pesadaSheet", { email, PlanillaPesadas }, { headers })
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
            const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/ecografiaSheet", { email, encargadoTrabajo, PlanillaEcografias }, { headers })
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
            const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/controlGarrapataSheet", { email, principioActivo, nombreLote, crearAlerta, PlanillaControlGarrapatas }, { headers })
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
            const resp = await generalApiV1.get("https://backend-software-ganadero.azurewebsites.net/testServiceConnection")
            console.log(resp)
        }
        catch (error) {
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))
        }

    }
}


//Procedimientos asincronicos auxiliares
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

export const cleanLoadComponent = () => {
    return async (dispatch) => {
        dispatch(loadComponent(null))
    }

}

export const saveInfoEstablecimiento = (nombre, dicoseFisico) => {
    return async (dispatch) => {
        dispatch(establecimiento({ nombre: nombre, dicoseFisico: dicoseFisico }))
    }

}