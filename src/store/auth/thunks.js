import { generalApiV1, generalSystemApi } from "../../apis";
import { alertas, errorMessage, establecimiento, establecimientos, idSesion, loadComponent, login, logout, selectUser, successMessage, tEcografias, tPesadas, tSanitarios } from "./authSlide"


export const startServices = (idSesion) => {
    return async (dispatch) => {
        try {
            const resp = await generalApiV1.get("https://backend-software-ganadero.azurewebsites.net/testServiceConnection")
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Inicializar servicios", "URL": generalApiV1.getUri(), "Endpoint": "testServiceConnection", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Inicializar servicios", "URL": generalApiV1.getUri(), "Endpoint": "testServiceConnection", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
        }
    }
}

//Recursos para guardar Métricas en BigQuery
const FechaYHora = (unidad) => {
    const hoy = new Date();
    const fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    if (unidad == "fecha") return fecha;
    else if (unidad == "hora") return hora;
}
const tabla = "Servicios"
export const saveToBigQuery = (tableName, data) => {
    return async (dispatch) => {
        const saveMetricsInsertDataToken = "b8fdca497ddf38c9a88d9ef66f1ca1cd40d367052046da43008d199848d62a0563e80f1d2f1564a6318880e77be2b6e58922e0c6830831c285bf50e110f34a14";
        const dataSetName = "TuCampoVirtual_DEV"
        const headers = {
            "Content-Type": "application/json"
        }
        const tableRowData = {}
        if (tableName = "Servicios") {
            //Preparar data para BQ
            tableRowData.idSesion = data.idSesion;
            tableRowData.Fecha = FechaYHora("fecha");
            tableRowData.Hora = FechaYHora("hora");
            tableRowData.Servicio = data.Servicio;
            tableRowData.URL = data.URL;
            tableRowData.Endpoint = data.Endpoint;
            tableRowData.Status = data.Status;
            tableRowData.Response = data.Response;
            tableRowData.Mensaje = data.Mensaje;
            try {
                const resp = await generalSystemApi.post("saveMetrics/insertData", { saveMetricsInsertDataToken, dataSetName, tableName, tableRowData }, { headers });
            }
            catch (error) {
                console.log("Ha ocurrido un error mientras se almacenaban métricas de uso de la aplicación")
            }
        }
        else if (tableName = "Funcionalidades") {
            console.log("Otra tabla")
        }

    }
}


export const registroUsuario = (idSesion, name, email, password) => {
    return async (dispatch) => {
        try {
            const resp = await generalSystemApi.post("https://backend-software-ganadero.azurewebsites.net/api/v1/system/signUp", { name, email, password });
            console.log(resp)
            if (resp.status == 201) {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Registro de usuario", "URL": generalSystemApi.getUri(), "Endpoint": "signUp", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
                dispatch(checkingAuth(idSesion, email, password))
            }
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Registro de usuario", "URL": generalSystemApi.getUri(), "Endpoint": "signUp", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            dispatch(errorMessage(error.response.data.message))
        }
    }

}
export const checkingAuth = (idSesion, email, password) => {
    return async (dispatch) => {

        try {
            const resp = await generalSystemApi.post("signIn", { email, password });
            if (resp.status == 200) {
                dispatch(login({ isLogged: true, token: resp.data.data.accessToken, nombre: resp.data.data.name, email: email }));
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Inicio de sesión", "URL": generalSystemApi.getUri(), "Endpoint": "signIn", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            }
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Inicio de sesión", "URL": generalSystemApi.getUri(), "Endpoint": "signIn", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
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
export const sendCodeRecoveryPassword = (idSesion, email) => {
    return async (dispatch) => {
        const passwordChangeRequestToken = "4ab6bac4a19d71cbda199912f94ae348d7f6c0b0eb1c9271699488644519e8b68007ce33883629aa5c57229be32b0755ac734e4b0cdf71adab6ae3b6f9fff338"
        try {
            const resp = await generalSystemApi.post("requestPasswordChange", { email, passwordChangeRequestToken });
            if (resp.status == 200) {
                dispatch(loadComponent("Success validate mail"))
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Solicitar recuperación de contraseña", "URL": generalSystemApi.getUri(), "Endpoint": "requestPasswordChange", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            }
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Solicitar recuperación de contraseña", "URL": generalSystemApi.getUri(), "Endpoint": "requestPasswordChange", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            let errorMessageText = ""
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
export const validateCodeRecoveryPassword = (idSesion, email, userOTPCode) => {
    return async (dispatch) => {
        const otpCodeValidationToken = "d6a363353c1265d07394fce40b840d275f266a29ace2adc8c40a31d78b274e2511363c5445550072d5000bc9bc457b206b9cc23b4e0dde103e7c60eee091f583"
        try {
            const resp = await generalSystemApi.post("validateOTPCode", { email, otpCodeValidationToken, userOTPCode });
            if (resp.status == 200) {
                dispatch(loadComponent("Success validate code"))
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Validar código OTP", "URL": generalSystemApi.getUri(), "Endpoint": "validateOTPCode", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            }
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Validar código OTP", "URL": generalSystemApi.getUri(), "Endpoint": "validateOTPCode", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
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
export const recoveryPassword = (idSesion, email, userOTPCode, newPassword) => {
    return async (dispatch) => {
        const passwordChangeToken = "a401f500e31be2dbdac6c6581f8a419f11c96ef2a512c324a1aab9b1e9774c9b60d794b7e0e8cf5de0f50b53273996b7dd7b66502eab49ded3e7d9d6248641bc"
        try {
            const resp = await generalSystemApi.post("passwordChange", { email, passwordChangeToken, userOTPCode, newPassword });
            if (resp.status == 200) {
                dispatch(successMessage("Tu contraseña ha sido actualizada con éxito. Inicia sesión con ella."))
                dispatch(loadComponent("Success password change"))
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Recuperación de contraseña", "URL": generalSystemApi.getUri(), "Endpoint": "passwordChange", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            }
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Recuperación de contraseña", "URL": generalSystemApi.getUri(), "Endpoint": "passwordChange", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
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
export const updateUser = (idSesion, email, token, name, password, type) => {
    return async (dispatch) => {
        const persistToken = token
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        if (type == "name") {
            try {
                const resp = await generalApiV1.post("user/update", { email, name }, { headers })
                if (resp.status == 200) {
                    dispatch(successMessage("El nombre de usuario se ha actualizado correctamente"))
                    dispatch(login({ isLogged: true, token: persistToken, nombre: resp.data.data.user.name, email: email }))
                    dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Actualizar usuario", "URL": generalApiV1.getUri(), "Endpoint": "user/update", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
                }
            }
            catch (error) {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Actualizar usuario", "URL": generalApiV1.getUri(), "Endpoint": "user/update", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
                let errorMessageText = "";
                if (error.response.status == "500") {
                    errorMessageText = "Error interno en el servidor"
                }
                else if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                    errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                    dispatch(closeSession())
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
                    dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Actualizar usuario", "URL": generalApiV1.getUri(), "Endpoint": "user/update", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
                }
            }
            catch (error) {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Actualizar usuario", "URL": generalApiV1.getUri(), "Endpoint": "user/update", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
                let errorMessageText = "";
                if (error.response.status == "500") {
                    errorMessageText = "Error interno en el servidor"
                }
                else if (error.response.status == "400" && error.response.data.message == "New password could not be same as old password") {
                    errorMessageText = "La nueva contraseña no puede ser igual a la contraseña anterior"
                }
                else if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                    errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                    dispatch(closeSession())
                }
                else {
                    errorMessageText = error.response.data.message
                }
                dispatch(errorMessage(errorMessageText))
            }
        }
    }
}
export const deleteUser = (idSesion, email, token,) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const resp = await generalApiV1.post("user/delete", { email }, { headers })
            dispatch(successMessage(resp.data.message));
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Eliminar usuario", "URL": generalApiV1.getUri(), "Endpoint": "user/delete", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            dispatch(logout());
        }
        catch (error) {
            if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                dispatch(closeSession())
            }
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Eliminar usuario", "URL": generalApiV1.getUri(), "Endpoint": "user/delete", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            dispatch(errorMessage(error.response.data.message))
        }
    }
}
export const closeSession = (idSesion, email, token) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const resp = await generalSystemApi.post("signOut", { email }, { headers });
            if (resp.status == 200) {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Cerrar sesión", "URL": generalSystemApi.getUri(), "Endpoint": "signOut", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            }
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Cerrar sesión", "URL": generalSystemApi.getUri(), "Endpoint": "signOut", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
        }
        dispatch(logout());
    }
}


export const getEstablecimientos = (idSesion, email, token) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const resp = await generalApiV1.post("establishment/get/all", { email }, { headers })
            dispatch(establecimientos(resp.data.data.establishments))
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener establecimientos", "URL": generalApiV1.getUri(), "Endpoint": "establishment/get/all", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener establecimientos", "URL": generalApiV1.getUri(), "Endpoint": "establishment/get/all", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            let errorMessageText = "";
            if (error.response.status == "404" && error.response.data.message == "No Establishments found of the User") {
                errorMessageText = "Aún no tienes establecimientos registrados."
            }
            else if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
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
export const agregarEstablecimiento = (idSesion, email, token, nombreEstablecimiento, nombreProductor, dicoseFisico, rubroPrincipal, cantidadDicosePropiedad, valoresDicosePropiedad) => {
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
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Agregar establecimiento", "URL": generalApiV1.getUri(), "Endpoint": "establishment/create", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            }
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Agregar establecimiento", "URL": generalApiV1.getUri(), "Endpoint": "establishment/create", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            let errorMessageText = "";
            if (error.response.status == "400" && error.response.data.message == "Establishment already registered") {
                errorMessageText = "El establecimiento ya se encuentra registrado"
            }
            else if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
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
    try {
        const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/animal/get/all/byEstablishment", { email, dicoseFisico }, { headers })
        //dispatch(saveToBigQuery(tabla,{"Servicio":"Obtener animales","URL":generalApiV1.getUri(),"Endpoint":"animal/get/all/byEstablishment","Status":resp.status,"Response":"Success", "Mensaje":resp.data.message}))
        return resp.data.data.animals;
    }
    catch (error) {
        if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
            //dispatch(saveToBigQuery(tabla,{"Servicio":"Obtener animales","URL":generalApiV1.getUri(),"Endpoint":"animal/get/all/byEstablishment","Status":error.response.status,"Response":"Failed", "Mensaje":error.response.data.message}))
        }
    }






}


//AuxFunctions para manejar el archivo descargado del SNIG
const formatAnimal = (item) => {
    const animal = {}
    const aux = item.split("\n")
    let newList = []
    for (const element in aux) {
        const campo = aux[element]
        if (campo.includes("<TD")) {
            newList.push(campo)
        }
    }
    for (const element in newList) {
        if (element == 0) {
            let dispositivo = newList[element]
            dispositivo = dispositivo.replaceAll("<TD>", "")
            dispositivo = dispositivo.replaceAll("</TD>", "")
            animal.dispositivo = dispositivo
        }
        else if (element == 1) {
            let raza = newList[element]
            raza = raza.replaceAll("<TD>", "")
            raza = raza.replaceAll("</TD>", "")
            animal.raza = raza
        }
        else if (element == 2) {
            let cruza = newList[element]
            cruza = cruza.replaceAll("<TD>", "")
            cruza = cruza.replaceAll("</TD>", "")
            animal.cruza = cruza
        }
        else if (element == 3) {
            let sexo = newList[element]
            sexo = sexo.replaceAll("<TD>", "")
            sexo = sexo.replaceAll("</TD>", "")
            animal.sexo = sexo
        }
        else if (element == 4) {
            let edadMeses = newList[element]
            edadMeses = edadMeses.replaceAll("<TD>", "")
            edadMeses = edadMeses.replaceAll("</TD>", "")
            animal.edadMeses = edadMeses
        }
        else if (element == 5) {
            let edadDias = newList[element]
            edadDias = edadDias.replaceAll("<TD>", "")
            edadDias = edadDias.replaceAll("</TD>", "")
            animal.edadDias = edadDias
        }
        else if (element == 6) {
            let dicosePropietario = newList[element]
            dicosePropietario = dicosePropietario.replaceAll("<TD style=\"mso-number-format:&quot;@&quot;\">", "")
            dicosePropietario = dicosePropietario.replaceAll("</TD>", "")
            animal.dicosePropietario = dicosePropietario
        }
        else if (element == 7) {
            let dicoseUbicacion = newList[element]
            dicoseUbicacion = dicoseUbicacion.replaceAll("<TD style=\"mso-number-format:&quot;@&quot;\">", "")
            dicoseUbicacion = dicoseUbicacion.replaceAll("</TD>", "")
            animal.dicoseUbicacion = dicoseUbicacion
        }
        else if (element == 8) {
            let dicoseTenedor = newList[element]
            dicoseTenedor = dicoseTenedor.replaceAll("<TD style=\"mso-number-format:&quot;@&quot;\">", "")
            dicoseTenedor = dicoseTenedor.replaceAll("</TD>", "")
            animal.dicoseTenedor = dicoseTenedor
        }
        else if (element == 9) {
            let status = newList[element]
            status = status.replaceAll("<TD>", "")
            status = status.replaceAll("</TD>", "")
            animal.status = status
        }
        else if (element == 10) {
            let trazabilidad = newList[element]
            trazabilidad = trazabilidad.replaceAll("<TD>", "")
            trazabilidad = trazabilidad.replaceAll("</TD>", "")
            animal.trazabilidad = trazabilidad
        }
        else if (element == 11) {
            let errores = newList[element]
            errores = errores.replaceAll("<TD>", "")
            errores = errores.replaceAll("</TD>", "")
            animal.errores = errores
        }

    }
    return animal;
}
const sanitize = (file) => {
    const animales = []
    file = file.replaceAll("<TR>", ",")
    file = file.replaceAll("</TR>", "")
    let aux = file.split(",")
    aux.shift()
    aux.shift()
    aux.map(item => (animales.push(formatAnimal(item))))
    return animales;
}
//Llamados para carga de animales y trabajos
export const sendFiletoBack = (idSesion, email, token, PlanillaAnimales) => {

    return async (dispatch) => {

        const valoresPlanillaAnimales = sanitize(PlanillaAnimales)
        if (valoresPlanillaAnimales.length > 400) {
            let mensaje = { "titulo": "¡Lo sentimos!", "contenido": "Actualmente soportamos archivos de hasta 400 animales.", "activeButton": false }
            dispatch(successMessage(mensaje))
        }
        else {
            token = "Bearer " + token;
            const headers = {
                "Content-Type": "application/json",
                "Authorization": token
            }
            try {
                const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/animalSheet", { email, valoresPlanillaAnimales }, { headers })
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar planilla de animales", "URL": generalApiV1.getUri(), "Endpoint": "file/animalSheet", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
                dispatch(successMessage(resp.data.message))
                console.log(resp)
                if (resp.status == 200) {
                    let mensaje = { "titulo": "Archivo cargado con éxito", "contenido": "Detalles", "activeButton": false }
                    const data = resp.data.data
                    const createdAnimals = data.createdAnimals
                    const errors = data.errors
                    const updatedAnimals = data.updatedAnimals
                    if (createdAnimals.length > 0) {
                        let text = "Se crearon los siguientes animales: "
                        createdAnimals.map(animal => { text = text + animal.dispositivo + ", " })
                        const newText = text.slice(0, -2)
                        mensaje["create"] = newText
                    }
                    if (updatedAnimals.length > 0) {
                        let text = "Se han actualizado los siguientes animales: "
                        updatedAnimals.map(animal => { text = text + animal.dispositivo + ", " })
                        const newText = text.slice(0, -2)
                        mensaje["update"] = newText
                    }
                    if (errors.length > 0) {
                        let text = "Se han encontrado errores en las siguientes filas: "
                        errors.map(animal => { text = text + animal.row + ", " })
                        const newText = text.slice(0, -2)
                        mensaje["error"] = newText
                    }
                    dispatch(successMessage(mensaje))
                }
            }
            catch (error) {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar planilla de animales", "URL": generalApiV1.getUri(), "Endpoint": "file/animalSheet", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
                if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                    errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                    dispatch(closeSession())
                }
                dispatch(errorMessage(error.response.data.message))
            }
        }

    }
}
export const sendFileTrabajoPesadatoBack = (idSesion, email, token, PlanillaPesadas) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        }

        try {
            const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/pesadaSheet", { email, PlanillaPesadas }, { headers })
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar trabajo de pesada", "URL": generalApiV1.getUri(), "Endpoint": "file/pesadaSheet", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            let message = resp.data.message
            message = message.replaceAll("File", "Archivo")
            message = message.replaceAll("saved successfully", "guardado exitosamente.")
            dispatch(successMessage(message))
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar trabajo de pesada", "URL": generalApiV1.getUri(), "Endpoint": "file/pesadaSheet", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            let errorMessageText = ""
            if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
            }
            dispatch(errorMessage(error.response.data.message))
        }

    }
}
export const sendFileTrabajoEcografiatoBack = (idSesion, email, token, encargadoTrabajo, PlanillaEcografias) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        }
        try {
            const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/ecografiaSheet", { email, encargadoTrabajo, PlanillaEcografias }, { headers })
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar trabajo de ecografías", "URL": generalApiV1.getUri(), "Endpoint": "file/ecografiaSheet", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            let message = resp.data.message
            message = message.replaceAll("File", "Archivo")
            message = message.replaceAll("saved successfully", "guardado exitosamente.")
            dispatch(successMessage(message))
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar trabajo de ecografías", "URL": generalApiV1.getUri(), "Endpoint": "file/ecografiaSheet", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            let errorMessageText = ""
            if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
            }
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))
        }
    }
}
export const sendFileTrabajoSanitariosGarrapatas = (idSesion, email, token, principioActivo, nombreLote, fecha, crearAlerta, PlanillaControlGarrapatas) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        }
        const fechaRealizacionTrabajo = fecha.replaceAll("-", "/")
        try {
            const resp = await generalApiV1.post("https://backend-software-ganadero.azurewebsites.net/api/v1/file/controlGarrapataSheet", { email, principioActivo, nombreLote, fechaRealizacionTrabajo, crearAlerta, PlanillaControlGarrapatas }, { headers })
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar trabajo de control de garrapatas", "URL": generalApiV1.getUri(), "Endpoint": "file/controlGarrapataSheet", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            let message = resp.data.message
            message = message.replaceAll("File", "Archivo")
            message = message.replaceAll("saved successfully", "guardado exitosamente.")
            dispatch(successMessage(message))
        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Ingresar trabajo de control de garrapatas", "URL": generalApiV1.getUri(), "Endpoint": "file/controlGarrapataSheet", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            let errorMessageText = ""
            if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
            }
            console.log(error.response.data.message)
            dispatch(errorMessage(error.response.data.message))
        }
    }
}
//Llamado para obtener todos los trabajos realizados
export const getTrabajos = (idSesion, trabajo, email, token) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const searchEmail = email;
            if (trabajo == "Pesadas") {
                const resp = await generalApiV1.post("pesada/get/all/byUser", { email, searchEmail }, { headers })
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener trabajos de pesadas del usuario", "URL": generalApiV1.getUri(), "Endpoint": "pesada/get/all/byUser", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
                dispatch(tPesadas(resp.data.data.pesadas))
            }
            else if (trabajo == "Ecografias") {
                const resp = await generalApiV1.post("ecografia/get/all/byUser", { email, searchEmail }, { headers })
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener trabajos de ecografias del usuario", "URL": generalApiV1.getUri(), "Endpoint": "ecografia/get/all/byUser", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
                dispatch(tEcografias(resp.data.data.ecografias))
            }
            else if (trabajo == "Sanitarios") {

                const resp = await generalApiV1.post("controlGarrapata/get/all/byUser", { email, searchEmail }, { headers })
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener trabajos sanitarios del usuario", "URL": generalApiV1.getUri(), "Endpoint": "controlGarrapata/get/all/byUser", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
                dispatch(tSanitarios(resp.data.data.controlGarrapatas))
                trabajo = "trabajos " + trabajo
            }

        }
        catch (error) {
            if (trabajo == "Pesadas") {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener trabajos de pesadas del usuario", "URL": generalApiV1.getUri(), "Endpoint": "pesada/get/all/byUser", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            }
            else if (trabajo == "Ecografias") {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener trabajos de ecografias del usuario", "URL": generalApiV1.getUri(), "Endpoint": "ecografia/get/all/byUser", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            }
            else if (trabajo == "Sanitarios") {
                dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener trabajos sanitarios del usuario", "URL": generalApiV1.getUri(), "Endpoint": "controlGarrapata/get/all/byUser", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            }

            let errorMessageText = "";
            if (error.response.status == "404") {
                errorMessageText = "Aún no hay " + trabajo.toLowerCase() + " en el sistema"
            }
            else if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
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

//Llamado para obtener todas las alertas del usuario
export const getAlertas = (idSesion, email, token) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const searchEmail = email;
            const resp = await generalApiV1.post("alertaControlGarrapata/get/all/byUser", { email, searchEmail }, { headers })
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener alertas del usuario", "URL": generalApiV1.getUri(), "Endpoint": "alertaControlGarrapata/get/all/byUser", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
            dispatch(alertas(resp.data.data.controlGarrapatas))

        }
        catch (error) {
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Obtener alertas del usuario", "URL": generalApiV1.getUri(), "Endpoint": "alertaControlGarrapata/get/all/byUser", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
            let errorMessageText = "";
            if (error.response.status == "404") {
                errorMessageText = "No tienes alertas registradas en el sistema"
            }
            else if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
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
export const updateAlerta = (idSesion, email, token, nombreLote, principioActivo, fechaNotificacion, estadoAlerta) => {
    return async (dispatch) => {
        token = "Bearer " + token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token
        }
        try {
            const resp = await generalApiV1.post("alertaControlGarrapata/update", { email, nombreLote, principioActivo, fechaNotificacion, estadoAlerta }, { headers })
            dispatch(successMessage("El estado de tu alerta se ha actualizado con éxito"))
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Actualizar estado de alerta", "URL": generalApiV1.getUri(), "Endpoint": "alertaControlGarrapata/update", "Status": resp.status, "Response": "Success", "Mensaje": resp.data.message }))
        }
        catch (error) {
            let errorMessageText = "";
            if (error.response.status == "401" && error.response.data.message == "You do not have permission to access on this route") {
                errorMessageText = "Tu sesión ha expirado, por favor vuelve a iniciarla"
                dispatch(closeSession())
            }
            else if (error.response.status == "500") {
                errorMessageText = "Error interno en el servidor"
            }
            else {
                errorMessageText = error.response.data.message
            }
            dispatch(errorMessage(errorMessageText))
            dispatch(saveToBigQuery(tabla, { "idSesion": idSesion, "Servicio": "Actualizar estado de alerta", "URL": generalApiV1.getUri(), "Endpoint": "alertaControlGarrapata/update", "Status": error.response.status, "Response": "Failed", "Mensaje": error.response.data.message }))
        }
    }
}

//Procedimientos asincronicos auxiliares para manejo de variables globales entre componentes
export const setIdSesion = (id) => {
    return async (dispatch) => {
        dispatch(idSesion(id))
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