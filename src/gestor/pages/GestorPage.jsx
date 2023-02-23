import { ConstructionOutlined, MailLockOutlined, UploadFile, UploadFileRounded } from "@mui/icons-material"
import { Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useState } from "react"
import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { selectAnimales, selectUser } from "../../store/auth"
import { obtenerAnimales, sendFiletoBack } from "../../store/auth/thunks"
import { GestorLayout } from "../layout/GestorLayout"

export const GestorPage = () => {

   

    const navigate = useNavigate();
    const goToAnimalesPage = () =>{
        navigate("/animales")
    }
    const goToTPesoPage = () =>{
        navigate("/trabajos/peso")
    }
    const goToTReproductivoPage = () =>{
        navigate("/trabajos/reproductivo")
    }
    const goToTSanitarioPage = () =>{
        navigate("/trabajos/sanitario")
    }
    
    return(
        <Grid>
            <GestorLayout>
            </GestorLayout>
            <Grid  container spacing={0} direction= "column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage:`url("http://demos.alan.sh/files/images/ujkoW.jpg")`,backgroundSize: "cover", backgroundPosition:"10% 52%", padding:4 }}>
                
                <Grid item container spacing={0} direction= "column" alignItems="center" justifyContent="center">
                    <Button variant="contained" sx={{marginBottom:5 , width:1/2}} color="primary" onClick={goToAnimalesPage}>Ver Animales</Button>
                </Grid>
                <Grid container spacing={4} direction= "row" alignItems="center" justifyContent="center">
                    <Grid item >
                        <Button variant="contained" color="primary" onClick={goToTPesoPage}>Registrar Pesada</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={goToTReproductivoPage}>Registrar Ecografías</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={goToTSanitarioPage}>Registrar Sanitario</Button>
                    </Grid>
                </Grid>
            </Grid>
            
            
        </Grid>
    )
}