import {Link as RouterLink} from "react-router-dom"
import { FileUploadOutlined } from "@mui/icons-material";
import { Alert, Button, FormControlLabel, Grid, IconButton, Switch, TextField, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "../../hooks";
import { selectErrorMessage, selectIdSesion, selectSuccessMessage, selectUser } from "../../store/auth";
import { cleanMessagge, sendFileTrabajoSanitariosGarrapatas } from "../../store/auth/thunks";
import { GestorLayout } from "../layout/GestorLayout"


export const TrabajoSanitarioPage = () => {

    const dispatch = useDispatch();
    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    useEffect(() => { if (errorMessage || successMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage, successMessage])


    //Funcion aux para manejo de fehca
    const FechaYHora = (unidad) => {
        const hoy = new Date();
        const fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        if (unidad == "fecha") return fecha;
        else if (unidad == "hora") return hora;
    }
    const { nombreLote, onInputChange } = useForm({
        nombreLote: ""
    })
    const user = useSelector(selectUser);
    const [textToShow, setTextToShow] = useState("Cargar archivo")
    const [fileTrabajoSanitariosGarrapatas, setFileTrabajoSanitarioGarrapatas] = useState({});
    const fileInputRef = useRef();
    const onFileInputChange = ({ target }) => {
        if (target.files === 0) return;
        console.log(target.files[0])
        setTextToShow(target.files[0].name)
        setFileTrabajoSanitarioGarrapatas(target.files[0])

    };
    const id =useSelector(selectIdSesion);
    const onSubmit = (event) => {
        event.preventDefault();
        console.log(fileTrabajoSanitariosGarrapatas)
        dispatch(sendFileTrabajoSanitariosGarrapatas(id, user.email, user.token, principioActivo, nombreLote, fecha, crearAlerta, fileTrabajoSanitariosGarrapatas))

    }

    const [crearAlerta, setCrearAlerta] = useState(true);
    const handleCrearAlerta = (event) => {
        setCrearAlerta(event.target.checked)
    }

    const [fecha, setFecha] = useState(null);
    const handleFecha = (event) => {
        setFecha(event.target.value)
    }

    const label = { inputProps: { 'aria-label': 'Switch demo' } };


    const [principioActivo, setPrincioActivo] = useState("")
    const handlePrincipioActivo = (event) => {
        setPrincioActivo(event.target.value)
    }
    return (
        <Grid>
            <GestorLayout>
                <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/nk4RN.png")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
                    <Grid item className="box-shadow"
                        xs={3}
                        sx={{ width: { sm: 450 }, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 3, borderRadius: 2 }}>
                        <Typography variant="h5">Registra tus tratamientos garrapaticidas</Typography>
                        <form onSubmit={onSubmit}>
                            <Grid container>
                                <Grid item xs={12} sx={{ '& .MuiTextField-root': { mt: 2, width: '44.5ch' }, }}>
                                    <TextField
                                        select
                                        label="Principio activo"
                                        SelectProps={{ native: true, }}
                                        onChange={handlePrincipioActivo} >
                                        <option key={1} value={"Alfacipermetrina3"}>
                                            {"Alfacipermetrina 3%"}
                                        </option>
                                        <option key={2} value={"Amitraz12.5"}>
                                            {"Amitraz 12.5%"}
                                        </option>
                                        <option key={3} value={"Cipermetrina15"}>
                                            {"Cipermetrina 15%"}
                                        </option>
                                        <option key={4} value={"Doramectina1"}>
                                            {"Doramectina 1%"}
                                        </option>
                                        <option key={5} value={"Eprinomectin0.5"}>
                                            {"Eprinomectin 0.5%"}
                                        </option>
                                        <option key={6} value={"Ethion40-Cipermetrina10"}>
                                            {"Ethion 40% + Cipermetrina 10%"}
                                        </option>
                                        <option key={7} value={"Fipronil1"}>
                                            {"Fipronil 1%"}
                                        </option>
                                        <option key={8} value={"Fluazuron2.5"}>
                                            {"Fluazuron 2.5%"}
                                        </option>
                                        <option key={9} value={"Flumetrina1"}>
                                            {"Flumetrina 1%"}
                                        </option>
                                        <option key={10} value={"Ivermectina1"}>
                                            {"Ivermectina 1%"}
                                        </option>
                                        <option key={11} value={"Ivermetina3.15"}>
                                            {"Ivermetina 3.15%"}
                                        </option>
                                        <option key={12} value={"Ivermectina1-Fluazuron12.5"}>
                                            {"Ivermectina 1% + Fluazuron 12.5%"}
                                        </option>
                                        <option key={13} value={"Moxidectin1"}>
                                            {"Moxidectin 1%"}
                                        </option>
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <TextField
                                        label="Nombre de lote"
                                        type="text"
                                        placeholder="Vacas de invernada"
                                        fullWidth
                                        name="nombreLote"
                                        value={nombreLote}
                                        onChange={onInputChange} />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <TextField
                                        id="date"
                                        label="Fecha de realización"
                                        type="date"
                                        defaultValue={FechaYHora("fecha")}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleFecha}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    ¿Crear alerta?
                                    <Switch {...label} defaultChecked onChange={handleCrearAlerta} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ padding: 10 }}>
                                <Grid item direction="column" alignItems="center" justifyContent="flex-end">
                                    <input type={"file"} onChange={onFileInputChange} style={{ display: "none" }} ref={fileInputRef}></input>
                                    <IconButton size="large" onClick={() => fileInputRef.current.click()}>
                                        <Typography variant="button">{textToShow}</Typography>
                                        <FileUploadOutlined color="primary" ></FileUploadOutlined>
                                    </IconButton>
                                </Grid>
                            </Grid>
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
                            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                                <Grid item xs={12} sm={12}>
                                    <Button type="submit" variant="contained" fullWidth>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                        <Grid container direction="row" justifyContent="end">
                            <Link component = {RouterLink} color="primary" to = "/trabajos/sanitario/alertas">
                                Gestionar mis alertas
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </GestorLayout>

        </Grid>
    )
}