import { Button, Grid } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectEstablecimientos, selectUser } from "../../store/auth";
import { saveInfoEstablecimiento, testEst } from "../../store/auth/thunks";
import { GestorLayout } from "../layout/GestorLayout"


export const EstablecimientosPage = () => {

    const navigate = useNavigate();
    const agregarEstablecimiento = () => {
        navigate("/nuevo/establecimiento")
    }
    
    const dispatch = useDispatch();
    const goToHomePage = (dicoseFisco, nombreEstablecimiento) =>{
        console.log(dicoseFisco)
        console.log(nombreEstablecimiento)
        dispatch(saveInfoEstablecimiento(nombreEstablecimiento,dicoseFisco))
        navigate("/")
    }
    
    const user = useSelector(selectUser); 
    useEffect(()=>{dispatch(testEst(user.email, user.token))},[])
    const establecimientos = useSelector(selectEstablecimientos);

    return(
        <GestorLayout>
        <Grid  container spacing={0} direction= "column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage:`url("http://demos.alan.sh/files/images/nk4RN.png")`,backgroundSize: "cover", backgroundPosition:"10% 52%", padding:4 }}>
        <Button variant="text" sx={{marginBottom:5 , width:1/2}} onClick={agregarEstablecimiento}>{"Agregar establecimiento"}</Button>
        {establecimientos?.map(establecimiento => (
            <Button variant="contained" sx={{marginBottom:5 , width:1/2}} key={establecimiento.dicoseFisico} onClick={()=>{ goToHomePage(establecimiento.dicoseFisico, establecimiento.nombreEstablecimiento)}}>{establecimiento.nombreEstablecimiento}</Button>
            
            )
        )}
        
        </Grid>
       </GestorLayout>
        
    )
}