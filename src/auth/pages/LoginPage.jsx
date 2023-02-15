import {Link as RouterLink, Navigate, useNavigate} from "react-router-dom"
import { Google } from "@mui/icons-material"
import { Alert, Button, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../layout/AuthLayout"
import { useForm } from "../../hooks"
import { useDispatch, useSelector } from "react-redux"
import { checkingAuth, cleanMessagge, newError } from "../../store/auth/thunks"
import { selectErrorMessage, selectUser } from "../../store/auth"
import { useEffect, useState } from "react"

export const LoginPage = () => {


    const dispatch = useDispatch();
    const {email, password, onInputChange} = useForm({
        email: "",
        password: ""

    })


    let errorMessage = useSelector(selectErrorMessage)
    const onSubmit = (event) => {
        event.preventDefault();
        if ( !email.includes("@") && (password.length<=8)) 
        {
            
            dispatch(newError("Por favor recuerda ingresar mail y contraseña válidos"))
        }
        else if (!email.includes("@"))
        {
            dispatch(newError("Por favor recuerda ingresar un mail válido"))
        }
        else if (password.length<8)
        {
            dispatch(newError("Por favor recuerda ingresar una contraseña válida"))
        }
        else 
        {
            dispatch(checkingAuth(email, password))
        }
        
    }
    const navigate = useNavigate(); 
    const user = useSelector(selectUser);
    useEffect(()=>{if(user){navigate("/establecimientos")}},[user])

    
    useEffect(()=>{if(errorMessage){setTimeout(function(){dispatch(cleanMessagge());}, 10000);}}, [errorMessage])
    


    
    return (
       
        <AuthLayout title="Iniciar Sesión"> 
            <form onSubmit={onSubmit}>
                    <Grid container>
                        <Grid item xs={12} sx={{mt:2}}>
                            <TextField 
                                color="firstPageButton"
                                label= "Correo" 
                                type = "email" 
                                placeholder="correo@google.com" 
                                fullWidth
                                name="email"
                                value= {email}
                                onChange= {onInputChange}
                                />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sx={{mt:2}}>
                            <TextField 
                                color="firstPageButton"
                                label= "Contraseña" 
                                type = "password" 
                                placeholder="Contraseña" 
                                fullWidth
                                name="password"
                                value= {password}
                                onChange= {onInputChange}
                                />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sx={{mt:2}} display={!!errorMessage? "" : "none"}>
                            <Alert severity="error">{errorMessage}</Alert>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx= {{mb : 2, mt: 1}}>
                        <Grid item xs={12} sm={12}>
                            <Button type="submit" variant="contained" fullWidth color="firstPageButton">
                                Ingresar
                            </Button>
                        </Grid>
                        
                        <Grid container direction="row" justifyContent="end">
                            <Link component = {RouterLink} color="inherit" to = "/auth/register">
                                Crear una cuenta
                            </Link>
                        </Grid>
                        <Grid container direction="row" justifyContent="end">
                            <Link component = {RouterLink} color="inherit" to = "/auth/passwordrecovery">
                                Recuperar contraseña
                            </Link>
                        </Grid>
                    </Grid>
                </form>

        </AuthLayout>
            

    )
}