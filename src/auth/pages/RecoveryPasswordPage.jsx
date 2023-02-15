import { Link as RouterLink, useNavigate } from "react-router-dom"
import { Google } from "@mui/icons-material"
import { Alert, Autocomplete, Button, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../layout/AuthLayout"
import { useForm } from "../../hooks"
import { useDispatch, useSelector } from "react-redux"
import { cleanMessagge, registroUsuario } from "../../store/auth/thunks"
import { selectErrorMessage, selectUser } from "../../store/auth"
import { useEffect } from "react"
import { useState } from "react"


export const RecoveryPasswordPage = () => {

    const { email, code, onInputChange } = useForm({
        email: "",
        code: ""

    })
    const dispatch = useDispatch();
    const onSubmit = (event) => {
        event.preventDefault();
        if (nameButton=="Enviar código"){

            //dispatch(registroUsuario(email, password)) ajustar cuando tenga endpoint de enviar codigo
            setNameButton("Validar código")
            setTextInfo("Ingresa el código recibido para validar tu identidad")
            setShowComponentsController(false)
        }
        else{

            //dispatch(registroUsuario(email, password)) ajustar cuando tenga endpoint de validar codigo
        }
        

    }
    const errorMessage = useSelector(selectErrorMessage)
    useEffect(() => { if (errorMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage])
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    useEffect(() => { if (user) { navigate("/establecimientos") } }, [user])

    const [nameButton, setNameButton] = useState("Enviar código")
    const [textInfo, setTextInfo] = useState("Ingresa tu mail para que te podamos enviar un código de recuperación de contraseña")
    const [showComponentsController, setShowComponentsController] = useState(true)
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
                        <TextField label="Ingresa tu mail" type="text" placeholder="juanperez@mail.com" fullWidth
                            disabled={!showComponentsController}
                            name="email"
                            color="firstPageButton"
                            value={email}
                            onChange={onInputChange} />
                    </Grid>
                </Grid>
                <Grid container display={(!showComponentsController) ? "" : "none"}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Ingresa el código" type="text" fullWidth
                            name="code"
                            color="firstPageButton"
                            value={code}
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
                        <Button type="submit" variant="contained" fullWidth color="firstPageButton"> 
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