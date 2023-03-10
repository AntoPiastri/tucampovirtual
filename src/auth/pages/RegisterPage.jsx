import { Link as RouterLink, useNavigate } from "react-router-dom"
import { Google } from "@mui/icons-material"
import { Alert, Autocomplete, Button, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../layout/AuthLayout"
import { useForm } from "../../hooks"
import { useDispatch, useSelector } from "react-redux"
import { cleanMessagge, newError, registroUsuario } from "../../store/auth/thunks"
import { selectErrorMessage, selectIdSesion, selectUser } from "../../store/auth"
import { useEffect } from "react"
import { useState } from "react"


export const RegisterPage = () => {

    const id =useSelector(selectIdSesion);
    const { name, email, password, confirmPassword, onInputChange } = useForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""

    })
    const dispatch = useDispatch();
    const onSubmit = (event) => {
        event.preventDefault();
        if ( (name.length<4)&&!email.includes("@") && (password.length<8)) 
        {
            dispatch(newError("Todos los campos son obligatorios"))
        }
        else if (!email.includes("@"))
        {
            dispatch(newError("Por favor recuerda ingresar un mail válido"))
        }
        else if (name.length<4)
        {
            dispatch(newError("El nombre debe tener al menos 4 caracteres"))
        }
        else if (password.length<8)
        {
            dispatch(newError("La contraseña debe tener al menos 8 caracteres"))
        }
        else if (password != confirmPassword)
        {
            dispatch(newError("Las contraseñas no coinciden"))
        }
        else 
        {
            dispatch(registroUsuario(id,name, email, password))
        }
    }
    const errorMessage = useSelector(selectErrorMessage)
    useEffect(() => { if (errorMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage])
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    useEffect(() => { if (user) { navigate("/establecimientos") } }, [user])

    
    return (
        <AuthLayout title="Crea tu cuenta">
            <form onSubmit={onSubmit}>
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Nombre completo" type="text" placeholder="Juan Perez" fullWidth
                            name="name"
                            color="primary"
                            value={name}
                            onChange={onInputChange} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Correo" type="email" placeholder="Correo" fullWidth
                            name="email"
                            color="primary"
                            value={email}
                            onChange={onInputChange} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Contraseña" type="password" placeholder="Contraseña" fullWidth
                            name="password"
                            color="primary"
                            value={password}
                            onChange={onInputChange} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Repetir contraseña" type="password" placeholder="Repetir contraseña" fullWidth
                            name="confirmPassword"
                            color="primary"
                            value={confirmPassword}
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
                            Crear cuenta
                        </Button>
                     

                    </Grid>

                    <Grid container direction="row" justifyContent="end">
                        <Typography sx={{ mr: 1, mt: 2 }}>¿Ya tienes una cuenta?</Typography>
                        <Link component={RouterLink} color="inherit" to="/auth/login" sx={{ mt: 2 }}>
                            Inicia sesión
                        </Link>


                    </Grid>
                </Grid>
            </form>

        </AuthLayout>


    )
}