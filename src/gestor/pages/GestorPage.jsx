import { Button, Grid} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { GestorLayout } from "../layout/GestorLayout"

export const GestorPage = () => {

    const navigate = useNavigate();
    const goToAnimalesPage = () =>{
        navigate("/animales")
    }
    const goToTrabajosPages = () =>{
        navigate("/trabajos")
    }
    const goToPesoPage = () =>{
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
                <Grid container spacing={4} direction= "row" alignItems="center" justifyContent="center">
                    <Grid item >
                        <Button variant="contained" sx={{marginBottom:5 }}color="primary" onClick={goToAnimalesPage}>Ver Animales</Button>
                    </Grid>
                    <Grid item >
                        <Button variant="contained" sx={{marginBottom:5}}color="primary" onClick={goToTrabajosPages}>Ver Trabajos</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={4} direction= "row" alignItems="center" justifyContent="center">
                    <Grid item >
                        <Button variant="contained" color="primary" onClick={goToPesoPage}>Registrar Pesada</Button>
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
                   