import { FileUploadOutlined } from "@mui/icons-material";
import { Alert, Button, Grid, IconButton, TextField, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../hooks";
import { selectErrorMessage, selectSuccessMessage, selectUser } from "../../store/auth";
import { cleanMessagge, sendFileTrabajoEcografiatoBack, sendFileTrabajoPesadatoBack } from "../../store/auth/thunks";
import { GestorLayout } from "../layout/GestorLayout"


export const TrabajoReproductivoPage = () => {

    const dispatch = useDispatch();
    const errorMessage = useSelector(selectErrorMessage)
    const successMessage = useSelector(selectSuccessMessage)
    useEffect(() => { if (errorMessage || successMessage) { setTimeout(function () { dispatch(cleanMessagge()); }, 5000); } }, [errorMessage, successMessage])


    const { encargadoTrabajo, onInputChange } = useForm({
        encargadoTrabajo : ""
    })
    const user = useSelector(selectUser);
    const [textToShow , setTextToShow] = useState("Cargar archivo")
    const [fileTrabajoEcografia, setFileTrabajoEcografia] = useState({});
    const fileInputRef = useRef();
    const onFileInputChange = ({ target }) => {
        if (target.files === 0) return;
        console.log(target.files[0])
        setTextToShow(target.files[0].name)
        setFileTrabajoEcografia(target.files[0])

    };
    const onSubmit = (event) => {
        event.preventDefault();
        console.log(fileTrabajoEcografia)
        dispatch(sendFileTrabajoEcografiatoBack(user.email, user.token, encargadoTrabajo ,fileTrabajoEcografia))

    }
    

    
    return (
        <Grid>
            <GestorLayout>
                <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage: `url("http://demos.alan.sh/files/images/nk4RN.png")`, backgroundSize: "cover", backgroundPosition: "10% 52%", padding: 4 }}>
                    <Grid item className="box-shadow"
                        xs={3}
                        sx={{ width: { sm: 450 }, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 3, borderRadius: 2 }}>
                        <Typography variant="h5">Registra tus ecografías</Typography>

                        <form onSubmit={onSubmit}>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Encargado"
                                    type="text"
                                    placeholder="Dr. Pablo De León"
                                    fullWidth
                                    name="encargadoTrabajo"
                                    value={encargadoTrabajo}
                                    onChange={onInputChange}
                                />
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
                    </Grid>
                </Grid>
            </GestorLayout>

        </Grid>
    )
}