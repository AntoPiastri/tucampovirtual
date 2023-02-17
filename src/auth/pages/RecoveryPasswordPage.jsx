import { Link as RouterLink, useNavigate } from "react-router-dom"
import { Alert, Button, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../layout/AuthLayout"
import { useForm } from "../../hooks"
import { useDispatch, useSelector } from "react-redux"
import { cleanLoadComponent, cleanMessagge, newError, recoveryPassword, sendCodeRecoveryPassword, validateCodeRecoveryPassword } from "../../store/auth/thunks"
import { selectErrorMessage, selectLoadComponent, selectUser } from "../../store/auth"
import { useEffect } from "react"
import { useState } from "react"


export const RecoveryPasswordPage = () => {

    const { email, code, newPassword, verifyNewPassword, onInputChange } = useForm({
        email: "",
        code: "",
        newPassword: "",
        verifyNewPassword: ""
    })
    const dispatch = useDispatch();
    const onSubmit = (event) => {
        event.preventDefault();
        if (!email.includes("@")) {
            dispatch(newError("Por favor recuerda ingresar un mail válido"))
        }
        else {
            if (nameButton == "Enviar código") {
                dispatch(sendCodeRecoveryPassword(email))
            }
            else if (nameButton == "Validar código") {
                if (code.length < 10) {
                    dispatch(newError("Por favor ingresa un código válido"))
                }
                else {
                    dispatch(validateCodeRecoveryPassword(email, code))
                }
            }
            else {
                if (newPassword != verifyNewPassword) {
                    dispatch(newError("Las contraseñas no coinciden"))
                }
                else if (newPassword.length < 8) {
                    dispatch(newError("La contraseña debe tener al menos 8 caracteres"))
                }
                else {
                    dispatch(recoveryPassword(email, code, newPassword))
                }
            }
        }


    }
    //Defino función para mostrar el campo de ingresar código unicamente si la respuesta del servicio fue exitosa
    const showCodeLabel = () => {

        if (loadComponent == "Success validate mail") {

            setNameButton("Validar código")
            setTextInfo("Ingresa el código recibido para validar tu identidad")
            setShowComponentsController(false)

        }
        else if (loadComponent == "Success validate code") {
            setNameButton("Cambiar contraseña")
            setTextInfo("Ingresa tu nueva contraseña")
            setShowComponentsController2(false)
        }
        else if (loadComponent == "Success password change") {
            navigate("/auth/login")
        }
        dispatch(cleanLoadComponent())
    }

    //Segun el estado del loadComponent muestro ciertos campos, por lo tanto debo ejecutar la función cada vez que el campo cambie
    const loadComponent = useSelector(selectLoadComponent)
    useEffect(() => { showCodeLabel() }, [loadComponent])


    const errorMessage = useSelector(selectErrorMessage)
    useEffect(() => { if (errorMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage])
    const navigate = useNavigate();


    const [nameButton, setNameButton] = useState("Enviar código")
    const [textInfo, setTextInfo] = useState("Ingresa tu mail para que te podamos enviar un código de recuperación de contraseña")
    const [showComponentsController, setShowComponentsController] = useState(true)
    const [showComponentsController2, setShowComponentsController2] = useState(true)
    return (
        <AuthLayout title="Recupera tu contraseña">
            <form onSubmit={onSubmit}>
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }} display={true ? "" : "none"}>
                        <Alert severity="info">{textInfo}</Alert>
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Ingresa tu mail" type="email" placeholder="juanperez@mail.com" fullWidth
                            disabled={!showComponentsController}
                            name="email"
                            color="primary"
                            value={email}
                            onChange={onInputChange} />
                    </Grid>
                </Grid>
                <Grid container display={(!showComponentsController) ? "" : "none"}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Ingresa el código" type="text" fullWidth
                            disabled={!showComponentsController2}
                            name="code"
                            color="primary"
                            value={code}
                            onChange={onInputChange} />
                    </Grid>
                </Grid>
                <Grid container display={(!showComponentsController2) ? "" : "none"}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Ingresa la nueva contraseña" type="password" fullWidth
                            name="newPassword"
                            color="primary"
                            value={newPassword}
                            onChange={onInputChange} />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Repetir contraseña" type="password" fullWidth
                            name="verifyNewPassword"
                            color="primary"
                            value={verifyNewPassword}
                            onChange={onInputChange} />
                    </Grid>
                </Grid>
                
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }} display={!!errorMessage ? "" : "none"}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth color="primary">
                            {nameButton}
                        </Button>
                    </Grid>
                    <Grid container direction="row" justifyContent="end">
                        <Typography sx={{ mr: 1, mt: 2 }}>¿Ya recordaste tu contraseña?</Typography>
                        <Link component={RouterLink} color="inherit" to="/auth/login" sx={{ mt: 2 }}>
                            Inicia sesión
                        </Link>
                    </Grid>
                </Grid>
            </form>

        </AuthLayout>


    )
}