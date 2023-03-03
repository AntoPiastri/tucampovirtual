import { Button,  Grid, TextField, Typography } from "@mui/material"
import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAlertas, selectErrorMessage, selectIdSesion, selectSuccessMessage, selectUser } from "../../store/auth";
import { cleanMessagge, getAlertas, updateAlerta} from "../../store/auth/thunks";
import { GestorLayout } from "../layout/GestorLayout"


export const AlertasPages = () => {

    const id =useSelector(selectIdSesion);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    useEffect(() => { if (errorMessage || successMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage, successMessage])

    
    useEffect(() => { dispatch(getAlertas(id,user.email, user.token)) }, [])
    const alertas = useSelector(selectAlertas)

    const actualizarAlerta = () =>
    {
        dispatch(updateAlerta(user.email, user.token, "1","2","3","4"))
    }
    return (
        <Grid>
            <GestorLayout>
                <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/nk4RN.png")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
                    <Grid item className="box-shadow"xs={3}sx={{ width: { sm: 650 }, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 3, borderRadius: 2 }}>
                        <Grid container spacing={4} direction= "row" alignItems="center" justifyContent="center">
                        <Grid item >
                            <Typography variant="h5">Gestiona tus alertas</Typography>
                            </Grid>
                            <Grid item >
                            {alertas?.map(alerta => (<Typography>Alerta 1: Lote {alerta.nombreLote} aplicado {alerta.principioActivo} {alerta.estadoAlerta}</Typography>))}
                            </Grid>
                            <Grid item >
                                <TextField label="Alerta"
                                        type="text"
                                        placeholder="1"
                                        fullWidth
                                        name="newName"
                                        //value={newName}
                                        //onChange={onInputChange} 
                                        />
                            </Grid>
                            <Grid item >
                                <Button variant="contained" onClick={actualizarAlerta}>Actualizar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </GestorLayout>

        </Grid>
    )
}