import { Alert, Button, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAlertas, selectErrorMessage, selectIdSesion, selectSuccessMessage, selectUser } from "../../store/auth";
import { cleanMessagge, getAlertas, newError, updateAlerta } from "../../store/auth/thunks";
import { GestorLayout } from "../layout/GestorLayout"


export const AlertasPages = () => {

    const id = useSelector(selectIdSesion);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    useEffect(() => { if (errorMessage || successMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage, successMessage])



    const alertas = useSelector(selectAlertas)
    useEffect(() => { dispatch(getAlertas(id, user.email, user.token)) }, [alertas])
    useEffect(() => { if (alertas != null) { handleAlertas(alertas) } }, [alertas])
    const [alertasAux, setAlertasAux] = useState([])
    const prepareNewAlert = (alerta, indice) => {
        const newAlert = {}
        newAlert.id = "Alerta " + (indice + 1);
        newAlert.nombreLote = alerta.nombreLote
        newAlert.principioActivo = alerta.principioActivo
        newAlert.fechaNotificacion = alerta.fechaNotificacion
        newAlert.estadoAlerta = alerta.estadoAlerta
        return newAlert
    }
    const handleAlertas = (alertas) => {
        const newAlertList = []
        alertas.map(alerta => (newAlertList.push(prepareNewAlert(alerta, alertas.indexOf(alerta)))))
        setAlertasAux(newAlertList)
    }
    const formatFechaNotificacion = (value) => {
        let aux = value.slice(0, 10);
        return aux;
    }
    const formatEstado = (value) => {
        if (value == "Activa") return "Inactiva"
        if (value == "Inactiva") return "Activa"
    }
    const actualizarAlerta = () => {
        if (idAlerta == null || idAlerta == "") {
            dispatch(newError("El identificador de alerta no puede estar vacio"))
        }
        else {
            let coincidencia = false
            for (let i = 0; i < alertasAux.length; i++) {
                const idOriginal = alertasAux[i].id
                if (idOriginal == idAlerta) {
                    dispatch(updateAlerta(id, user.email, user.token, alertasAux[i].nombreLote, alertasAux[i].principioActivo, formatFechaNotificacion(alertasAux[i].fechaNotificacion), formatEstado(alertasAux[i].estadoAlerta)))
                    coincidencia = true
                }
            }
            if (!coincidencia) {
                dispatch(newError("El identificador de alerta ingresado no coincide con ninguna de sus alertas"))
            }
        }
    }
    const [idAlerta, setIdAlerta] = useState(null)
    const handleUpdateAlerta = (event) => {
        setIdAlerta(event.target.value)
    }
    return (
        <Grid>
            <GestorLayout>
                <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/nk4RN.png")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
                    <Grid item className="box-shadow" xs={3} sx={{ width: { sm: 650 }, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 3, borderRadius: 2 }}>
                        <Grid container spacing={4} direction="row" alignItems="center" justifyContent="center">
                            <Grid item >
                                <Typography variant="h5">Gestiona tus alertas</Typography>
                            </Grid>
                            <Grid item >
                                {alertasAux?.map(alerta => (<Typography key={alerta.id}>{alerta.id}: Lote {alerta.nombreLote} aplicado {alerta.principioActivo} {alerta.estadoAlerta}</Typography>))}
                            </Grid>
                            <Grid item >
                                <TextField label="Alerta"
                                    type="text"
                                    placeholder="Alerta 1"
                                    fullWidth
                                    name="alertaId"
                                    onChange={handleUpdateAlerta} />
                            </Grid>
                            <Grid item >
                                <Button variant="contained" onClick={actualizarAlerta}>Actualizar</Button>
                            </Grid>
                        </Grid>
                        <Grid item >
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }} display={!!successMessage ? "" : "none"}>
                                    <Alert severity="success">{successMessage}</Alert>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }} display={!!errorMessage ? "" : "none"}>
                                    <Alert severity="error">{errorMessage}</Alert>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </GestorLayout>
        </Grid>
    )
}