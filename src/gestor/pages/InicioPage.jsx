import { Button, Grid } from "@mui/material"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { selectIdSesion } from "../../store/auth";
import { setIdSesion, startServices } from "../../store/auth/thunks";



export const InicioPage = () => {
    const id =useSelector(selectIdSesion);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => { dispatch(setIdSesion(uuid())) }, [])
    const Comenzar = () => {
        dispatch(startServices(id))
        navigate("/auth/login")
    }

    return (
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/QAFdw.jpg")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
            <Grid container spacing={4} direction="column" alignItems="center" justifyContent="center">
                <Grid item>
                    <section>
                        <img src="http://demos.alan.sh/files/images/kUu9H.jpg"></img>
                        <img src="http://demos.alan.sh/files/images/vxbmH.jpg"></img>
                        <img src="http://demos.alan.sh/files/images/C9MZu.jpg"></img>
                        <img src="http://demos.alan.sh/files/images/KfCYz.jpg"></img>
                        <img src="http://demos.alan.sh/files/images/nk4RN.png"></img>

                    </section>
                </Grid>
                <Grid item>
                    <Button variant="contained" fullWidth color="primary" onClick={Comenzar}>
                        COMENZAR
                    </Button>
                </Grid>
            </Grid>
        </Grid>

    )
}
